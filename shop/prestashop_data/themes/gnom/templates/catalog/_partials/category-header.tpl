<div id="js-product-list-header">
    {if isset($subcategories) && $subcategories|@count > 0}
    <span class='category-headline-centered'>
        <h1 class="h1 category-h1-centered">{$category.name}</h1>
    </span>
    {else}
    <span class='category-headline'>
        <h1 class="h1 category-h1">{$category.name}</h1>
    </span>
    {/if}
</div>