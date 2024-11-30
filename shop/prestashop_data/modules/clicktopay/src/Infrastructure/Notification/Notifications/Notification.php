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

namespace ClickToPay\Module\Infrastructure\Notification\Notifications;

if (!defined('_PS_VERSION_')) {
    exit;
}

class Notification implements \JsonSerializable
{
    /** @var string */
    private $type;
    /** @var string */
    private $message;
    /** @var string */
    private $id;

    private function __construct(
        string $id,
        string $type,
        string $message
    ) {
        $this->type = $type;
        $this->message = $message;
        $this->id = $id;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getMessage(): string
    {
        return $this->message;
    }

    public static function create(
        string $type,
        string $message
    ): Notification {
        return new self(
            uniqid(), // NOTE just to make unsetting it easier in json.
            (string) $type,
            (string) $message
        );
    }

    public static function createFromArray(array $data): Notification
    {
        return new self(
            $data['id'],
            $data['type'],
            $data['message']
        );
    }

    public function jsonSerialize(): array
    {
        $json = [];
        $json['id'] = $this->id;
        $json['type'] = $this->type;
        $json['message'] = $this->message;

        return $json;
    }
}
