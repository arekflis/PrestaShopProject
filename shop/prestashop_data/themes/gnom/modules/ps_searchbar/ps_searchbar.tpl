<div id="search-bar-div" data-search-controller-url="{$search_controller_url}">
  <div class="header-search-bar">
    <form id="search-bar-form" method="get" action="{$search_controller_url}">
      <input type="hidden" name="controller" value="search">
      <input id="search-input" type="text" name="s" value="{$search_string}" placeholder="{l s='Wpisz czego szukasz' d='Shop.Theme.Catalog'}" aria-label="{l s='Search' d='Shop.Theme.Catalog'}">
      <i class="material-icons search" id="search-icon" aria-hidden="true">search</i>
    </form>
  </div>
</div>