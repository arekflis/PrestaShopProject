<div id="_desktop_user_info">
  <div class="user-info text-underlined">
    {if $logged}
      <a
        class="logout hidden-sm-down text-underlined"
        href="{$urls.actions.logout}"
        rel="nofollow"
      >
        {l s='Sign out' d='Shop.Theme.Actions'}
      </a>
      <a
        class="account text-underlined"
        href="{$urls.pages.my_account}"
        title="{l s='View my customer account' d='Shop.Theme.Customeraccount'}"
        rel="nofollow"
      >
        <span class="hidden-sm-down text-underlined">{$customerName}</span>
      </a>
    {else}
      <a
        href="{$urls.pages.my_account}"
        title="{l s='Log in to your customer account' d='Shop.Theme.Customeraccount'}"
        rel="nofollow"
      >
        <span class="text-underlined">{l s='Sign in' d='Shop.Theme.Actions'}</span>
      </a>
    {/if}
  </div>
</div>