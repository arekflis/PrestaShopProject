{**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 *}
{extends file=$layout}

{block name='header'}
  {include file='checkout/_partials/header.tpl'}
{/block}

{* Progress bar variables *}

{$addressTick = -1}
{$deliveryTick = -1}
{$paymentTick = -1}

{block name='content'}
  <section id="content">
      {* Add --active class to light up the circle *}
    {block name='progress-bar'}
    <section id="Progress" class="progress mb-3 py-1 py-md-0">
        <!-- Krok 1: Koszyk -->
        <div class="progress__item --first --shopping-cart">
            <div class="progress__icons">
                <div class="progress__icon --mobile d-md-none">
                    <span class="progress__step">
                        <strong>1</strong>
                        <span>/4</span>
                    </span>
                    <svg class="progress__svg">
                        <circle class="progress__circle_back"></circle>
                        <circle class="progress__circle"></circle>
                    </svg>
                </div>
                <div class="progress__icon --desktop d-none d-md-flex">
                    <span class="progress__fontello"></span>
                </div>
            </div>
            <div class="progress__text">
                <strong class="progress__name">Koszyk</strong>
                <span class="progress__description"></span>
            </div>
        </div>

        <!-- Krok 2: Twoje dane -->
          {foreach Context::getContext()->controller->getCheckoutProcess()->getSteps() as $index => $step}
          {if $step->isComplete() && $step->getTitle() == 'Dane osobowe'}
          <div class="progress__item --second --file-text">
          {$addressTick = 1}
          {/if}
          {/foreach}
          {if $addressTick < 0}
          <div class="progress__item --second --active --file-text">
          {/if}
            <div class="progress__icons">
                <div class="progress__icon --mobile d-md-none">
                    <span class="progress__step">
                        <strong>2</strong>
                        <span>/4</span>
                    </span>
                    <svg class="progress__svg">
                        <circle class="progress__circle_back"></circle>
                        <circle class="progress__circle"></circle>
                    </svg>
                </div>
                <div class="progress__icon --desktop d-none d-md-flex">
                    <span class="progress__fontello"></span>
                </div>
            </div>
            <div class="progress__text">
                <strong class="progress__name">Twoje dane</strong>
                <span class="progress__description">Zaloguj się lub podaj dane</span>
            </div>
        </div>

        <!-- Krok 3: Dostawa i płatności -->
         {foreach Context::getContext()->controller->getCheckoutProcess()->getSteps() as $index => $step}
          {if $step->isComplete() && $step->getTitle() == 'Sposób dostawy'}
          <div class="progress__item --third --truck">
          {$deliveryTick = 1}
          {/if}
          {/foreach}
          {if $deliveryTick < 0}
          <div class="progress__item --third --active --truck">
          {/if}
            <div class="progress__icons">
                <div class="progress__icon --mobile d-md-none">
                    <span class="progress__step">
                        <strong>3</strong>
                        <span>/4</span>
                    </span>
                    <svg class="progress__svg">
                        <circle class="progress__circle_back"></circle>
                        <circle class="progress__circle"></circle>
                    </svg>
                </div>
                <div class="progress__icon --desktop d-none d-md-flex">
                    <span class="progress__fontello"></span>
                </div>
            </div>
            <div class="progress__text">
                <strong class="progress__name">Dostawa i płatności</strong>
                <span class="progress__description">Wybierz sposób dostawy i płatności</span>
            </div>
        </div>

        <!-- Krok 4: Weryfikacja danych -->
         {foreach Context::getContext()->controller->getCheckoutProcess()->getSteps() as $index => $step}
          {if $step->isComplete() && $step->getTitle() == 'Płatność'}
          <div class="progress__item --fourth --comment">
          {$paymentTick = 1}
          {/if}
          {/foreach}
          {if $paymentTick < 0}
          <div class="progress__item --fourth --active --comment">
          {/if}
            <div class="progress__icons">
                <div class="progress__icon --mobile d-md-none">
                    <span class="progress__step">
                        <strong>4</strong>
                        <span>/4</span>
                    </span>
                    <svg class="progress__svg">
                        <circle class="progress__circle_back"></circle>
                        <circle class="progress__circle"></circle>
                    </svg>
                </div>
                <div class="progress__icon --desktop d-none d-md-flex">
                    <span class="progress__fontello"></span>
                </div>
            </div>
            <div class="progress__text">
                <strong class="progress__name">Weryfikacja danych</strong>
                <span class="progress__description">
                    Sprawdź poprawność zamówienia przed jego złożeniem
                </span>
            </div>
        </div>
    </section>
    {/block}
    <div class="row">
      <div class="cart-grid-body col-xs-12 col-lg-8">
        {block name='checkout_process'}
          {render file='checkout/checkout-process.tpl' ui=$checkout_process}
        {/block}
      </div>
      <div class="cart-grid-right col-xs-12 col-lg-4">
        {block name='cart_summary'}
          {include file='checkout/_partials/cart-summary.tpl' cart=$cart}
        {/block}
      </div>
    </div>
  </section>
{/block}

{block name='footer'}
  {include file="_partials/footer.tpl"}
{/block}

