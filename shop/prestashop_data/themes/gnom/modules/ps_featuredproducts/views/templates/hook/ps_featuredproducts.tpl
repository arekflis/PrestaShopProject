<section class="featured-product-section">
  <h1>{l s='Nowe produkty' d='Modules.Featuredproducts.Shop'}</h1>
  <div class="products">
    {foreach from=$products item="product"}
      {include file="catalog/_partials/miniatures/product.tpl" product=$product}
    {/foreach}
  </div>
  <a href="{$allProductsLink}">{l s='All products' d='Modules.Featuredproducts.Shop'}</a>
</section>