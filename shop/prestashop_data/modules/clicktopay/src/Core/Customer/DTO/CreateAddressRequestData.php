<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Core\Customer\DTO;

use ClickToPay\Module\Infrastructure\Request\Request;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CreateAddressRequestData
{
    /**
     * @var string
     */
    private $city;

    /**
     * @var string
     */
    private $countryCode;
    /**
     * @var string
     */
    private $zip;

    /**
     * @var string
     */
    private $state;

    /**
     * @var string
     */
    private $line1;

    private function __construct(string $city, string $countryCode, string $zip, string $line1, string $state)
    {
        $this->city = $city;
        $this->countryCode = $countryCode;
        $this->zip = $zip;
        $this->line1 = $line1;
        $this->state = $state;
    }

    public static function createFromRequest(Request $request): CreateAddressRequestData
    {
        return new self(
            $request->get('city') ?? '',
            $request->get('countryCode') ?? '',
            $request->get('zip') ?? '',
            $request->get('line1') ?? '',
            $request->get('state') ?? ''
        );
    }

    /**
     * @return string
     */
    public function getCity(): string
    {
        return $this->city;
    }

    /**
     * @return string
     */
    public function getCountryCode(): string
    {
        return $this->countryCode;
    }

    /**
     * @return string
     */
    public function getZip(): string
    {
        return $this->zip;
    }

    /**
     * @return string
     */
    public function getState(): string
    {
        return $this->state;
    }

    /**
     * @return string
     */
    public function getLine1(): string
    {
        return $this->line1;
    }
}
