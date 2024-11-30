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

namespace ClickToPay\Module\Core\Shared\Repository;

use ClickToPay\Module\Infrastructure\Adapter\Context;
use ClickToPay\Module\Infrastructure\Adapter\Tools;
use ClickToPay\Module\Infrastructure\EntityManager\EntityManagerInterface;
use ClickToPay\Module\Infrastructure\EntityManager\ObjectModelUnitOfWork;
use ClickToPay\Module\Infrastructure\Repository\CollectionRepository;

if (!defined('_PS_VERSION_')) {
    exit;
}

class ClickToPayRefundRepository extends CollectionRepository implements ClickToPayRefundRepositoryInterface
{
    private $entityManager;
    private $tools;
    private $context;

    public function __construct(EntityManagerInterface $entityManager, Tools $tools, Context $context)
    {
        parent::__construct(\ClickToPayRefund::class);

        $this->entityManager = $entityManager;
        $this->tools = $tools;
        $this->context = $context;
    }

    public function getRefundedAmount(int $orderId, int $shopId): int
    {
        $query = new \DbQuery();

        $query
            ->select('SUM(refunded_amount) as refunded')
            ->from(\ClickToPayRefund::$definition['table'])
            ->where(sprintf('id_order = %d AND id_shop = %d', $orderId, $shopId))
            ->groupBy('id_order');

        return (int) \Db::getInstance()->getValue($query);
    }

    public function createRefund(int $refundInCents, int $orderId, int $shopId, string $token, string $gatewayId): void
    {
        $refund = new \ClickToPayRefund();

        $refund->refunded_amount = $refundInCents;
        $refund->id_order = $orderId;
        $refund->id_shop = $shopId;
        $refund->refund_transaction_token = $token;
        $refund->transaction_gateway_id = $gatewayId;

        $this->entityManager->persist($refund, ObjectModelUnitOfWork::UNIT_OF_WORK_SAVE);
        $this->entityManager->flush();
    }
}
