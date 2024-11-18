<div id="header-container">
    <div id="_desktop_logo">
          {if $shop.logo_details}
            {if $page.page_name == 'index'}
              <h1>
                {renderLogo}
              </h1>
            {else}
              {renderLogo}
            {/if}
          {/if}
    </div>

    {widget name='ps_searchbar'}

    <div id="header-login">
      <div id="gird-cell-login">
        <div id="flag-and-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" width="24" height="16">
            <rect width="640" height="480" fill="#dc143c"/>
            <rect width="640" height="240" fill="#fff"/>
          </svg>
          <i class="material-icons keyboard_arrow_down">keyboard_arrow_down</i>
        </div>
        {widget name='ps_customersignin'}
        <p id="listy-zakupowe" class="text-underlined">Listy zakupowe</p>
        <i class="material-icons keyboard_arrow_down">keyboard_arrow_down</i>
      </div>
    </div>
    
    <div id="shopping-cart-div">
      {widget name='ps_shoppingcart'}
    </div>

    <div id="categories-div">
      {widget name='ps_mainmenu'}
    </div>
</div>

