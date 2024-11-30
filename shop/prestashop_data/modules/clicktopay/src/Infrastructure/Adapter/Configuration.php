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

namespace ClickToPay\Module\Infrastructure\Adapter;

use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use Configuration as PrestaShopConfiguration;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Configuration
{
    private $globalShopContext;

    public function __construct(GlobalShopContextInterface $globalShopContext)
    {
        $this->globalShopContext = $globalShopContext;
    }

    /**
     * @param string|array{production: string, sandbox: string} $id
     * @param mixed $value
     * @param int|null $shopId
     */
    public function set($id, $value, $shopId = null)
    {
        if (!$shopId) {
            $shopId = $this->globalShopContext->getShopId();
        }

        PrestaShopConfiguration::updateValue($id, $value, false, null, $shopId);
    }

    /**
     * @param string|array{production: string, sandbox: string} $id
     * @param int|null $shopId
     *
     * @return false|string|null
     */
    public function get($id, ?int $shopId = null)
    {
        if (!$shopId) {
            $shopId = $this->globalShopContext->getShopId();
        }

        $result = PrestaShopConfiguration::get($id, null, null, $shopId);

        return $result ?: null;
    }

    public function getAsBoolean($id, ?int $shopId = null)
    {
        $result = $this->get($id, $shopId);

        if (in_array($result, ['null', 'false', '0', null, false, 0], true)) {
            return false;
        }

        return (bool) $result;
    }

    public function getAsInteger($id, ?int $shopId = null)
    {
        $result = $this->get($id, $shopId);

        if (in_array($result, ['null', 'false', '0', null, false, 0], true)) {
            return 0;
        }

        return (int) $result;
    }

    /**
     * @param string $key Configuration key
     * @param mixed $values $values is an array if the configuration is multilingual, a single string else
     * @param bool $html Specify if html is authorized in value
     * @param int $idShopGroup
     * @param int $idShop
     */
    public function updateValue($key, $values, $idShop = null, $html = false, $idShopGroup = null)
    {
        if ($idShop === null) {
            $shops = \Shop::getShops(true);
            foreach ($shops as $shop) {
                PrestaShopConfiguration::updateValue($key, $values, $html, $shop['id_shop_group'], $shop['id_shop']);
            }

            return;
        }

        PrestaShopConfiguration::updateValue($key, $values, $html, $idShopGroup, $idShop);
    }

    /**
     * @param array{production: string, sandbox: string}|string $id
     */
    public function delete($id)
    {
        PrestaShopConfiguration::deleteByName($id);
    }

    /**
     * @param array{production: string, sandbox: string}|string $id
     * @param ?int $shopId
     */
    public function remove($id, ?int $shopId = null)
    {
        if (!$shopId) {
            $shopId = $this->globalShopContext->getShopId();
        }

        // making sure to set to null value only for single shop id
        PrestaShopConfiguration::updateValue($id, null, false, null, $shopId);
    }
}
