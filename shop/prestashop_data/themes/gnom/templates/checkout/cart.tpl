{extends file=$layout}

{if $cart.products|@count > 0}
    {block name='content'}

    {*<section id="main">
        <div class="cart-grid row">

        <!-- Left Block: cart product informations & shpping -->
        <div class="cart-grid-body col-xs-12 col-lg-8">

            <!-- cart products detailed -->
            <div class="card cart-container">
            <div class="card-block">
                <h1 class="h1">{l s='Shopping Cart' d='Shop.Theme.Checkout'}</h1>
            </div>
            <hr class="separator">
            {block name='cart_overview'}
                {include file='checkout/_partials/cart-detailed.tpl' cart=$cart}
            {/block}
            </div>

            {block name='continue_shopping'}
            <a class="label" href="{$urls.pages.index}">
                <i class="material-icons">chevron_left</i>{l s='Continue shopping' d='Shop.Theme.Actions'}
            </a>
            {/block}

            <!-- shipping informations -->
            {block name='hook_shopping_cart_footer'}
            {hook h='displayShoppingCartFooter'}
            {/block}
        </div>

        <!-- Right Block: cart subtotal & cart total -->
        <div class="cart-grid-right col-xs-12 col-lg-4">

            {block name='cart_summary'}
            <div class="card cart-summary">

                {block name='hook_shopping_cart'}
                {hook h='displayShoppingCart'}
                {/block}

                {block name='cart_totals'}
                {include file='checkout/_partials/cart-detailed-totals.tpl' cart=$cart}
                {/block}

                {block name='cart_actions'}
                {include file='checkout/_partials/cart-detailed-actions.tpl' cart=$cart}
                {/block}

            </div>
            {/block}

        </div>

        </div>
    </section>*}

<div id="content" class="col-12">
    <div class="fake-breadcrumbs">
        <span>
            <a href="/">Strona główna</a>
            <i class="material-icons">chevron_right</i>
            Koszyk
        </span>
    </div>

    {* Add --active class to light up the circle *}
    {block name='progress-bar'}
    <section id="Progress" class="progress mb-3 py-1 py-md-0">
        <!-- Krok 1: Koszyk -->
        <div class="progress__item --first --active --shopping-cart">
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
        <div class="progress__item --second --file-text">
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
        <div class="progress__item --third --truck">
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
        <div class="progress__item --fourth --comment">
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

    <div class="basket-div">
        <h2 class="basket-header">Twój koszyk</h2>
        {*<div class="basket-information-div">
            <div class="basket-table --single-price">Cena jedn.</div>
            <div class="basket-table --value">Wartość</div>
            <div class="basket-table --amount">Ilosc</div>
            <div class="basket-table --calculate">Przelicz</div>
            <div class="basket-table --delete">Usuń</div>
        </div>*}
    </div>

    <div class="basket__productslist">
        <div class="basket__block --labels"><div class="basket__item --photo"></div><div class="basket__item --name"></div><div class="basket__item --prices">
									Cena jedn.
								</div><div class="basket__item --sum">
									Wartość
								</div><div class="basket__item --actions"><div class="basket__action --quantity">
										Ilość
									</div><div class="basket__action --calculate">
										Przelicz
									</div><div class="basket__action --remove">
										Usuń
									</div></div></div>

                                     {block name='cart_overview'}
        {include file='checkout/_partials/cart-detailed.tpl' cart=$cart}
    {/block}
    </div>

    {block name='cart_summary'}
            {*<div class="card cart-summary">

                {block name='hook_shopping_cart'}
                {hook h='displayShoppingCart'}
                {/block}

                {block name='cart_totals'}
                {include file='checkout/_partials/cart-detailed-totals.tpl' cart=$cart}
                {/block}

                {block name='cart_actions'}
                {include file='checkout/_partials/cart-detailed-actions.tpl' cart=$cart}
                {/block}

            </div>*}

            <div class="basketedit_summary_container">
                <div class="basketedit_summary">
                    <div class="basketedit_summary_sub">
                        <div class="basketedit_summary_left">
                            <div class="summary_delivery_time">
                                <span class="material-icons local_shipping">local_shipping</span>
                                <span class="summary_delivery_time__info">
                                <span class="summary_delivery_time__text">Przewidywana dostawa za </span>
                                <strong class="summary_delivery_time__time">
                                <span class="summary_delivery_time__week_day">1 dni</span>
                                </strong>
                                </span>
                            </div>
                            <div class="toshippingfree">
                                <div class="toshippingfree_sub">DARMOWA DOSTAWA od 
									<span class="price">450,00 PLN</span>
                                </div>
                                {if $cart.totals.total.amount < 450}
								Brakuje Ci tylko <b>{450-$cart.totals.total.amount}</b>, aby ją otrzymać.
                                {/if}
							</div>
                        </div>
                        <div class="basketedit_summary_right">
                            <div class="basketedit_calculations">
                                <div class="basketedit_product_summary">
                                <label>
									Wartość zamówienia:
								</label>
                                <strong>{$cart.totals.total.amount} PLN</strong>
                                </div>
                               <div class="basketedit_product_summary">
                               <label>Koszt przesyłki od: </label>
                               {if $cart.totals.total.amount < 450}
                               <strong class="plus_sign">14,90 PLN</strong>
                               {else}
                               <strong>DARMOWA</strong>
                               {/if}
                               </div>
                               <div class="basketedit_product_summary"></div>
                            </div>
                            <div class="basketedit_total_summary">
                                <label> Do zapłaty: </label>
                                <strong style="font-size:28px">
                                {$cart.totals.total.amount} PLN
                                <span class="price_vat">brutto</span>
                                </strong>
                            </div>
                        </div>
                        
                        <div class="basketedit_summary_bottom"></div>
                    </div>
                </div>
                <div class="basketedit_summary_buttons">
                    <div class="basketedit_summary_buttons__item --continue">
                    <a class="basketedit_summary_buttons__go_shopping" href="/">Kontynuuj zakupy w sklepie</a>
                    </div>
                    <div class="text-sm-center">
                        <a href="{$urls.pages.order}" class="btn btn-primary checkout-button">{l s='Proceed to checkout' d='Shop.Theme.Actions'}</a>
                        {hook h='displayExpressCheckout'}
                     </div>
                </div>
            </div>
            
           {hook h='displayOrderConfirmation2'}
            {*$cart|dump*}

        

    {/block}
   
</div>
        {/block}
{else}
    {block name='content'}
    <div class='fake-breadcrumbs'>
        <span><a href="/">Strona główna</a><i class="material-icons">chevron_right</i>Uwaga</span>
    </div>
    </div>
    <div class ="row clearfix">
        <div id="content" class="col-12">
            <div class="n54531_outline" id="return_message">
                <div class="n54531_outline_sub menu_messages_message" id="return_sub_basket_empty">
                    <div class="basket_icon_wrapper">
                        <img src="https://localhost:19348/img/cms/gnom-cart-empty-icon.png">
                    </div>
                    <h3 class="return_label">Twój koszyk jest pusty.</h3>
                    <p>Dodaj do niego produkty, aby móc rozpocząć składanie zamówienia.</p>
                </div>
            </div>
            <div class="n54744_goback">
            <a class="btn --solid --medium n54744" href="/" id="retbut_basket_empty">Rozpocznij zakupy</a>
            </div>
        </div>
    </div>
    {/block}

{/if}