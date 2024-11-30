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

namespace ClickToPay\Module\Infrastructure\Repository;

if (!defined('_PS_VERSION_')) {
    exit;
}

class CollectionRepository implements ReadOnlyCollectionRepositoryInterface
{
    /**
     * @var string
     */
    private $fullyClassifiedClassName;

    public function __construct(string $fullyClassifiedClassName)
    {
        $this->fullyClassifiedClassName = $fullyClassifiedClassName;
    }

    public function findAllInCollection($langId = null): \PrestaShopCollection
    {
        return new \PrestaShopCollection($this->fullyClassifiedClassName, $langId);
    }

    /**
     * @param array $keyValueCriteria
     * @param $langId
     *
     * @return bool|\ObjectModel|null
     *
     * @throws \PrestaShopException
     */
    public function findOneBy(array $keyValueCriteria, $langId = null): ?\ObjectModel
    {
        $psCollection = new \PrestaShopCollection($this->fullyClassifiedClassName, $langId);

        foreach ($keyValueCriteria as $field => $value) {
            $psCollection = $psCollection->where($field, '=', $value);
        }

        $first = $psCollection->getFirst();

        return false === $first ? null : $first;
    }
}
