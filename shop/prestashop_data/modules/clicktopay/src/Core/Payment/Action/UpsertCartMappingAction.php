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

namespace ClickToPay\Module\Core\Payment\Action;

use ClickToPay\Module\Core\Payment\Exception\CouldNotAddCartMapping;
use ClickToPay\Module\Core\Shared\Repository\ClickToPayCartRepositoryInterface;
use ClickToPay\Module\Infrastructure\Context\GlobalShopContextInterface;
use ClickToPay\Module\Infrastructure\EntityManager\EntityManagerInterface;
use ClickToPay\Module\Infrastructure\EntityManager\ObjectModelUnitOfWork;
use ClickToPay\Module\Infrastructure\Logger\LoggerInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class UpsertCartMappingAction
{
    private $logger;
    private $globalShopContext;
    private $entityManager;
    private $clickToPayCartRepository;

    public function __construct(
        LoggerInterface $logger,
        GlobalShopContextInterface $globalShopContext,
        EntityManagerInterface $entityManager,
        ClickToPayCartRepositoryInterface $clickToPayCartRepository
    ) {
        $this->logger = $logger;
        $this->globalShopContext = $globalShopContext;
        $this->entityManager = $entityManager;
        $this->clickToPayCartRepository = $clickToPayCartRepository;
    }

    /**
     * @throws CouldNotAddCartMapping
     */
    public function run(int $internalId, bool $expressCheckout)
    {
        $this->logger->debug(sprintf('%s - Function called', __METHOD__));

        try {
            $cart = $this->clickToPayCartRepository->findOneBy([
                'id_cart' => $internalId,
                'id_shop' => $this->globalShopContext->getShopId(),
            ]);
        } catch (\Throwable $exception) {
            throw CouldNotAddCartMapping::unknownError($exception);
        }

        try {
            $cart = $cart ?: new \ClickToPayCart();
            $cart->id_cart = $internalId;
            $cart->express_checkout = $expressCheckout;
            $cart->id_shop = $this->globalShopContext->getShopId();

            $this->entityManager->persist($cart, ObjectModelUnitOfWork::UNIT_OF_WORK_SAVE);
            $this->entityManager->flush();
        } catch (\Throwable $exception) {
            throw CouldNotAddCartMapping::unknownError($exception);
        }

        $this->logger->debug(sprintf('%s - Function ended', __METHOD__));
    }
}
