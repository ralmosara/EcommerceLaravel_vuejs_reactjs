<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Address\StoreAddressRequest;
use App\Http\Requests\Address\UpdateAddressRequest;
use App\Http\Requests\Address\SetDefaultAddressRequest;
use App\Http\Resources\AddressResource;
use App\Services\CustomerService;
use App\Traits\ApiResponses;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    use ApiResponses;

    public function __construct(
        protected CustomerService $customerService
    ) {}

    /**
     * Display a listing of the user's addresses.
     */
    public function index(Request $request): JsonResponse
    {
        $addresses = $this->customerService->getAddresses($request->user()->id);

        return $this->successResponse(
            AddressResource::collection($addresses),
            'Addresses retrieved successfully'
        );
    }

    /**
     * Store a newly created address.
     */
    public function store(StoreAddressRequest $request): JsonResponse
    {
        $address = $this->customerService->createAddress(
            $request->user()->id,
            $request->validated()
        );

        return $this->createdResponse(
            new AddressResource($address),
            'Address created successfully'
        );
    }

    /**
     * Display the specified address.
     */
    public function show(Request $request, int $addressId): JsonResponse
    {
        $address = $this->customerService->getAddress(
            $request->user()->id,
            $addressId
        );

        if (!$address) {
            return $this->notFoundResponse('Address not found');
        }

        return $this->successResponse(
            new AddressResource($address),
            'Address retrieved successfully'
        );
    }

    /**
     * Update the specified address.
     */
    public function update(UpdateAddressRequest $request, int $addressId): JsonResponse
    {
        $address = $this->customerService->updateAddress(
            $request->user()->id,
            $addressId,
            $request->validated()
        );

        if (!$address) {
            return $this->notFoundResponse('Address not found');
        }

        return $this->successResponse(
            new AddressResource($address),
            'Address updated successfully'
        );
    }

    /**
     * Remove the specified address.
     */
    public function destroy(Request $request, int $addressId): JsonResponse
    {
        $deleted = $this->customerService->deleteAddress(
            $request->user()->id,
            $addressId
        );

        if (!$deleted) {
            return $this->notFoundResponse('Address not found');
        }

        return $this->successResponse(null, 'Address deleted successfully');
    }

    /**
     * Set an address as default.
     */
    public function setDefault(SetDefaultAddressRequest $request, int $addressId): JsonResponse
    {
        $type = $request->validated()['type'];
        $userId = $request->user()->id;

        $success = $type === 'shipping'
            ? $this->customerService->setDefaultShippingAddress($userId, $addressId)
            : $this->customerService->setDefaultBillingAddress($userId, $addressId);

        if (!$success) {
            return $this->notFoundResponse('Address not found');
        }

        return $this->successResponse(
            null,
            "Address set as default {$type} successfully"
        );
    }
}
