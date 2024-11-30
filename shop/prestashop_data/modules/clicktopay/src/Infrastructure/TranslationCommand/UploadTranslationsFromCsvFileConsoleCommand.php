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

class UploadTranslationsFromCsvFileConsoleCommand extends Command
{
    public const CSV_POSITION_ID = 0;

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

    private $module;

    public function __construct(\ClickToPay $module)
    {
        parent::__construct();
        $this->module = $module;
    }

    protected function configure()
    {
        $this
            ->setName('clicktopay:upload-translation-csv')
            ->setAliases(['m:g:t:c'])
            ->setDescription('Upload translation csv');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        include_once $this->module->getLocalPath() . '/translations/en.php';

        $csvHeader = "<?php\n\nglobal \$_MODULE;\n\$_MODULE = array();\n";

        try {
            $handle = fopen('translation.csv', 'r');
            $headerLine = [];
            if ($handle) {
                $i = 0;
                while (($lines = fgetcsv($handle)) !== false) {
                    if ($i === 0) {
                        $headerLine = $lines;
                        unset($headerLine[0]);

                        foreach ($headerLine as $languageIso) {
                            file_put_contents("translations/{$languageIso}.php", $csvHeader);
                        }

                        ++$i;

                        continue;
                    }

                    foreach ($headerLine as $key => $languageIso) {
                        $this->updateTranslation("translations/{$languageIso}.php", $lines, $key);
                    }
                }
            } else {
                $output->writeln("<error>Couldn't find csv file</error>");
            }
        } catch (\Exception $e) {
            $output->writeln("<error>{$e->getMessage()}</error>");

            return 0;
        }

        $output->writeln('<info>Translation upload finished</info>');

        return 0;
    }

    private function updateTranslation($file, $values, $position)
    {
        if (!isset($values[$position]) || '' === $values[$position]) {
            return;
        }

        $translatedText = str_replace(['\\', "'", '"'], ['\\\\', "\'", ''], $values[$position]);

        $translationLine =
            '$_MODULE[\'' . $values[self::CSV_POSITION_ID] . '\'] = \'' . $translatedText . "';\n";

        file_put_contents($file, $translationLine, FILE_APPEND);
    }
}
