{if !empty($subcategories)}
  {if (isset($display_subcategories) && $display_subcategories eq 1) || !isset($display_subcategories) }
    <div id="subcategories" class="card card-block">
      <ul class="subcategories-list">
        {foreach from=$subcategories item=subcategory}
          <li class="subcategories-list-item">
            <a class="subcategory-name" href="{$link->getCategoryLink($subcategory.id_category, $subcategory.link_rewrite)|escape:'html':'UTF-8'}">{$subcategory.name|truncate:25:'...'|escape:'html':'UTF-8'}</a>
              {if $subcategory.description}
                <div class="cat_desc">{$subcategory.description|unescape:'html' nofilter}
            </div>
              {/if}
          </li>
        {/foreach}
      </ul>
    </div>
  {/if}
{/if}
