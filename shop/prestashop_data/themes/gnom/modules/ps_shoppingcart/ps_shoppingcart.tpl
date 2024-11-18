<div id="_desktop_cart">
  {*$cart|dump*}

  {** sciezka do kwoty lacznej cart.totals.total.value **}
  <div class="blockcart cart-preview {if $cart.products_count > 0}active{else}inactive{/if}" data-refresh-url="{$refresh_url}">
    <div id="shopping-cart-header" class="header">
      {if $cart.products_count > 0}
        <a rel="nofollow" aria-label="{l s='Shopping cart link containing %nbProducts% product(s)' sprintf=['%nbProducts%' => $cart.products_count] d='Shop.Theme.Checkout'}" href="{$cart_url}">
      {/if}
        <i class="material-icons shopping-cart" aria-hidden="true">shopping_cart</i>
        
        <span class="cart-products-count">{$cart.totals.total.value}</span>
      {if $cart.products_count > 0}
        </a>
      {/if}
    </div>
  </div>
</div>