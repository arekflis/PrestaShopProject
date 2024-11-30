<?php
/**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 */

namespace ClickToPay\Module\Infrastructure\TranslationCommand;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

if (!defined('_PS_VERSION_')) {
    exit;
}

class TranslationCsvFileGeneratorConsoleCommand extends Command
{
    private $module;

    // NOTE: Positioning is important.
    public const LANGUAGE_ISOS = [
        'en',
        'es',
        'it',
        'nl',
        'fr',
        'de',
        'pt',
        'pl',
        'sv',
    ];

    public function __construct(\ClickToPay $module)
    {
        parent::__construct();
        $this->module = $module;
    }

    protected function configure()
    {
        $this
            ->setName('clicktopay:generate-translation-csv')
            ->setAliases(['m:g:t:c'])
            ->setDescription('Generate translation csv');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        include_once $this->module->getLocalPath() . 'translations/en.php';

        $translations = $GLOBALS['_MODULE'];

        try {
            $fp = fopen('translation.csv', 'w');
            $fields = [];

            foreach ($translations as $id => $text) {
                $field = array_map('utf8_decode', [$id, $text]);
                $fields[$field[0]] = $field;
            }
        } catch (\Exception $e) {
            $output->writeln("<error>{$e->getMessage()}</error>");

            return 0;
        }

        $header = array_merge(['ID'], self::LANGUAGE_ISOS);

        fputcsv($fp, $header, ';');

        foreach (self::LANGUAGE_ISOS as $position => $file) {
            include $this->module->getLocalPath() . "translations/{$file}.php";

            $translations = $GLOBALS['_MODULE'];

            foreach ($translations as $id => $text) {
                // NOTE: $position + 1 because of ID
                $fields[$id][$position + 1] = $text;
            }
        }
        foreach ($fields as $field) {
            if (!isset($field[0])) {
                continue;
            }

            fputcsv($fp, $field, ';');
        }

        fclose($fp);

        $output->writeln('<info>Translation export to CSV finished</info>');

        return 0;
    }
}
