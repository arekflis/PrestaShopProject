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

namespace ClickToPay\Module\Infrastructure\EntityManager;

if (!defined('_PS_VERSION_')) {
    exit;
}

interface EntityManagerInterface
{
    /**
     * @param \ObjectModel $model
     * @param string $unitOfWorkType - @see ObjectModelUnitOfWork
     * @param string|null $specificKey
     *
     * @return EntityManagerInterface
     */
    public function persist(
        \ObjectModel $model,
        string $unitOfWorkType,
        ?string $specificKey = null
    ): EntityManagerInterface;

    /**
     * @return array<\ObjectModel>
     *
     * @throws \PrestaShopException
     */
    public function flush(): array;
}
