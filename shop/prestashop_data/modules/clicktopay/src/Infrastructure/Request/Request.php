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

namespace ClickToPay\Module\Infrastructure\Request;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Request extends \Symfony\Component\HttpFoundation\Request
{
    public function all(): array
    {
        return $this->request->all() + $this->query->all() + (json_decode(\Tools::file_get_contents('php://input'), true) ?? []) + $this->files->all();
    }

    /**
     * @return mixed|null
     */
    public function get($key, $default = null, $deep = false)
    {
        $data = (json_decode(\Tools::file_get_contents('php://input'), true) ?? []);

        if (parent::get($key)) {
            return parent::get($key);
        }

        if (isset($data[$key])) {
            return $data[$key];
        }

        return $default;
    }
}
