import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, CreditCard, MapPin, Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/api/useCart';
import { useCreateOrder } from '@/hooks/api/useOrders';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { formatPrice } from '@/utils/formatters';
import { addressSchema } from '@/utils/validators';
import { COUNTRIES, SHIPPING_METHODS } from '@/utils/constants';
import { toast } from 'react-hot-toast';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { paymentsApi } from '@/api/endpoints/payments';
import { getStripe } from '@/services/stripeService';

type CheckoutStep = 'shipping' | 'billing' | 'method' | 'review' | 'payment';

const checkoutSchema = z.object({
  shipping_address: addressSchema,
  billing_address: addressSchema.optional(),
  use_same_address: z.boolean(),
  shipping_method: z.string().optional(),
  customer_notes: z.string().max(1000).optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const stripePromise = getStripe();

function CheckoutPageContent() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { data: cart, isLoading: cartLoading } = useCart();
  const createOrder = useCreateOrder();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [selectedShipping, setSelectedShipping] = useState(SHIPPING_METHODS[0].id);
  const [createdOrderUuid, setCreatedOrderUuid] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      use_same_address: true,
      shipping_method: SHIPPING_METHODS[0].id,
      shipping_address: {
        country: 'US',
      },
      billing_address: {
        country: 'US',
      },
    },
  });

  const useSameAddress = watch('use_same_address');
  const shippingAddress = watch('shipping_address');

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && (!cart || cart.items.length === 0)) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart, cartLoading, navigate]);

  const steps: Array<{ id: CheckoutStep; label: string; icon: any }> = [
    { id: 'shipping', label: 'Shipping Address', icon: MapPin },
    { id: 'billing', label: 'Billing Address', icon: MapPin },
    { id: 'method', label: 'Shipping Method', icon: Package },
    { id: 'review', label: 'Review Order', icon: CheckCircle2 },
    { id: 'payment', label: 'Payment', icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const validateStep = async (): Promise<boolean> => {
    if (currentStep === 'shipping') {
      return await trigger('shipping_address');
    }
    if (currentStep === 'billing' && !watch('use_same_address')) {
      return await trigger('billing_address');
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (currentStep === 'shipping') setCurrentStep('billing');
    else if (currentStep === 'billing') setCurrentStep('method');
    else if (currentStep === 'method') setCurrentStep('review');
    else if (currentStep === 'review') {
      await handleCreateOrder();
    }
  };

  const handleBack = () => {
    if (currentStep === 'billing') setCurrentStep('shipping');
    else if (currentStep === 'method') setCurrentStep('billing');
    else if (currentStep === 'review') setCurrentStep('method');
    else if (currentStep === 'payment') setCurrentStep('review');
  };

  const handleCreateOrder = async () => {
    if (!cart) return;

    const formData = watch();

    const orderData = {
      shipping_address: formData.shipping_address,
      billing_address: formData.use_same_address ? undefined : formData.billing_address,
      use_same_address: formData.use_same_address,
      shipping_method: selectedShipping,
      customer_notes: formData.customer_notes,
    };

    createOrder.mutate(orderData, {
      onSuccess: (order) => {
        setCreatedOrderUuid(order.uuid);
        setCurrentStep('payment');
        toast.success('Order created successfully');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create order');
      },
    });
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !createdOrderUuid) {
      toast.error('Payment system not ready');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Card element not found');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create payment intent
      const { client_secret } = await paymentsApi.createIntent(createdOrderUuid);

      // Confirm payment
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: shippingAddress.full_name,
            phone: shippingAddress.phone,
            address: {
              line1: shippingAddress.address_line1,
              line2: shippingAddress.address_line2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postal_code,
              country: shippingAddress.country,
            },
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Payment successful
      toast.success('Payment successful!');
      navigate(`/payment-success?order=${createdOrderUuid}`);
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-punk-dark flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const shippingCost = SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.price || 0;
  const tax = cart.total * 0.1; // 10% tax
  const orderTotal = cart.total + shippingCost + tax;

  return (
    <div className="min-h-screen bg-punk-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center text-punk-orange hover:text-punk-coral mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-white uppercase tracking-wider">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStepIndex >= index;
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center ${
                        isActive
                          ? 'bg-punk-orange text-white'
                          : 'bg-punk-gray text-gray-500'
                      } ${isCurrent ? 'ring-4 ring-punk-orange/30' : ''}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium hidden sm:block ${
                        isActive
                          ? 'text-white'
                          : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 ${
                        currentStepIndex > index
                          ? 'bg-punk-orange'
                          : 'bg-punk-gray'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-punk-gray p-6 border border-punk-black">
              {/* Shipping Address Step */}
              {currentStep === 'shipping' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Full Name"
                        {...register('shipping_address.full_name')}
                        error={errors.shipping_address?.full_name?.message}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Phone"
                        type="tel"
                        {...register('shipping_address.phone')}
                        error={errors.shipping_address?.phone?.message}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 1"
                        {...register('shipping_address.address_line1')}
                        error={errors.shipping_address?.address_line1?.message}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Input
                        label="Address Line 2 (Optional)"
                        {...register('shipping_address.address_line2')}
                        error={errors.shipping_address?.address_line2?.message}
                      />
                    </div>
                    <Input
                      label="City"
                      {...register('shipping_address.city')}
                      error={errors.shipping_address?.city?.message}
                    />
                    <Input
                      label="State / Province"
                      {...register('shipping_address.state')}
                      error={errors.shipping_address?.state?.message}
                    />
                    <Input
                      label="Postal Code"
                      {...register('shipping_address.postal_code')}
                      error={errors.shipping_address?.postal_code?.message}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Country
                      </label>
                      <select
                        {...register('shipping_address.country')}
                        className="block w-full px-3 py-2 border text-white bg-punk-black border-punk-gray focus:outline-none focus:border-punk-orange transition-colors"
                      >
                        {COUNTRIES.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.shipping_address?.country && (
                        <p className="mt-1 text-sm text-red-400">
                          {errors.shipping_address.country.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Address Step */}
              {currentStep === 'billing' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Billing Address
                  </h2>
                  <div className="mb-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('use_same_address')}
                        className="w-4 h-4 bg-punk-black border-punk-gray text-punk-orange focus:ring-punk-orange"
                      />
                      <span className="ml-2 text-gray-300">
                        Same as shipping address
                      </span>
                    </label>
                  </div>

                  {!useSameAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Input
                          label="Full Name"
                          {...register('billing_address.full_name')}
                          error={errors.billing_address?.full_name?.message}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Phone"
                          type="tel"
                          {...register('billing_address.phone')}
                          error={errors.billing_address?.phone?.message}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Address Line 1"
                          {...register('billing_address.address_line1')}
                          error={errors.billing_address?.address_line1?.message}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Input
                          label="Address Line 2 (Optional)"
                          {...register('billing_address.address_line2')}
                          error={errors.billing_address?.address_line2?.message}
                        />
                      </div>
                      <Input
                        label="City"
                        {...register('billing_address.city')}
                        error={errors.billing_address?.city?.message}
                      />
                      <Input
                        label="State / Province"
                        {...register('billing_address.state')}
                        error={errors.billing_address?.state?.message}
                      />
                      <Input
                        label="Postal Code"
                        {...register('billing_address.postal_code')}
                        error={errors.billing_address?.postal_code?.message}
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Country
                        </label>
                        <select
                          {...register('billing_address.country')}
                          className="block w-full px-3 py-2 border text-white bg-punk-black border-punk-gray focus:outline-none focus:border-punk-orange transition-colors"
                        >
                          {COUNTRIES.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        {errors.billing_address?.country && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.billing_address.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Method Step */}
              {currentStep === 'method' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Shipping Method
                  </h2>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-colors ${
                          selectedShipping === method.id
                            ? 'border-punk-orange bg-punk-orange/10'
                            : 'border-punk-black hover:border-punk-orange/50'
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={(e) => {
                              setSelectedShipping(e.target.value);
                              setValue('shipping_method', e.target.value);
                            }}
                            className="text-punk-orange focus:ring-punk-orange bg-punk-black border-punk-gray"
                          />
                          <div className="ml-3">
                            <p className="font-medium text-white">
                              {method.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {method.description}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-punk-orange">
                          {formatPrice(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Step */}
              {currentStep === 'review' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Review Order
                  </h2>

                  <div className="space-y-6">
                    {/* Shipping Address */}
                    <div>
                      <h3 className="font-semibold text-white mb-2 uppercase text-sm tracking-wider">
                        Shipping Address
                      </h3>
                      <div className="text-gray-400 bg-punk-black p-4">
                        <p>{shippingAddress.full_name}</p>
                        <p>{shippingAddress.address_line1}</p>
                        {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                        <p>
                          {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                        </p>
                        <p>{COUNTRIES.find((c) => c.code === shippingAddress.country)?.name}</p>
                        <p>{shippingAddress.phone}</p>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h3 className="font-semibold text-white mb-2 uppercase text-sm tracking-wider">
                        Shipping Method
                      </h3>
                      <p className="text-gray-400 bg-punk-black p-4">
                        {SHIPPING_METHODS.find((m) => m.id === selectedShipping)?.name} -{' '}
                        <span className="text-punk-orange">{formatPrice(shippingCost)}</span>
                      </p>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-semibold text-white mb-2 uppercase text-sm tracking-wider">
                        Order Items
                      </h3>
                      <div className="space-y-2 bg-punk-black p-4">
                        {cart.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-gray-400"
                          >
                            <span>
                              {item.album.title} x {item.quantity}
                            </span>
                            <span className="text-white">{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        {...register('customer_notes')}
                        rows={3}
                        className="block w-full px-3 py-2 border text-white bg-punk-black border-punk-gray focus:outline-none focus:border-punk-orange transition-colors"
                        placeholder="Any special instructions for your order..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                    Payment Information
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">
                      Card Details
                    </label>
                    <div className="p-4 border border-punk-gray bg-punk-black">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#ffffff',
                              '::placeholder': {
                                color: '#6b7280',
                              },
                            },
                            invalid: {
                              color: '#ef4444',
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-punk-black p-4 mb-6 border border-punk-gray">
                    <p className="text-sm text-gray-400 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-punk-orange" />
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-8">
                {currentStepIndex > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep !== 'payment' && (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    className="flex-1"
                    isLoading={createOrder.isPending}
                  >
                    {currentStep === 'review' ? 'Place Order' : 'Next'}
                    {currentStep !== 'review' && <ArrowRight className="h-4 w-4 ml-2" />}
                  </Button>
                )}
                {currentStep === 'payment' && (
                  <Button
                    variant="primary"
                    onClick={handlePayment}
                    className="flex-1"
                    isLoading={isProcessingPayment}
                    disabled={!stripe}
                  >
                    Pay {formatPrice(orderTotal)}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-punk-gray p-6 sticky top-4 border border-punk-black">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-punk-black">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-punk-black overflow-hidden flex-shrink-0">
                      {item.album.cover_image ? (
                        <img
                          src={item.album.cover_image}
                          alt={item.album.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.album.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-punk-orange">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(cart.subtotal)}</span>
                </div>

                {cart.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(cart.discount_amount)}</span>
                  </div>
                )}

                {currentStep !== 'shipping' && (
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">{formatPrice(shippingCost)}</span>
                  </div>
                )}

                {currentStep !== 'shipping' && (
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span className="text-white">{formatPrice(tax)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-6 border-t border-punk-black">
                <span className="text-lg font-bold text-white uppercase">Total</span>
                <span className="text-2xl font-bold text-punk-orange">
                  {formatPrice(currentStep === 'shipping' ? cart.total : orderTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap CheckoutPageContent with Stripe Elements provider
export function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPageContent />
    </Elements>
  );
}
