<?php
/*
 * Since 2007 PayPal
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 *  versions in the future. If you wish to customize PrestaShop for your
 *  needs please refer to http://www.prestashop.com for more information.
 *
 *  @author Since 2007 PayPal
 *  @author 202 ecommerce <tech@202-ecommerce.com>
 *  @license http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 *  @copyright PayPal
 *
 */

namespace PaypalPPBTlib\Utils\Translate;

use Translate;

trait TranslateTrait
{
    /**
     * Translation method for classes that use this trait
     *
     * @param string $textToTranslate
     * @param string $class
     * @param bool $addslashes
     * @param bool $htmlentities
     *
     * @return mixed
     */
    protected function l($textToTranslate, $class = '', $addslashes = false, $htmlentities = true)
    {
        if (empty($class) === true) {
            $class = $this->getClassShortName();
        }

        return Translate::getModuleTranslation('paypal', $textToTranslate, $class);
    }

    /**
     * @return string
     *
     * @throws \ReflectionException
     */
    protected function getClassShortName()
    {
        return (new \ReflectionClass($this))->getShortName();
    }
}
