<div class="block-contact col-md-3 links wrapper">
  <div class="title clearfix hidden-md-up" data-target="#contact-infos" data-toggle="collapse">
    <span class="h3">{l s='Store information' d='Shop.Theme.Global'}</span>
    <span class="float-xs-right">
      <span class="navbar-toggler collapse-icons">
        <i class="material-icons add">keyboard_arrow_down</i>
        <i class="material-icons remove">keyboard_arrow_up</i>
      </span>
    </span>
  </div>

  <p class="h4 text-uppercase block-contact-title hidden-sm-down">{l s='Store information' d='Shop.Theme.Global'}</p>
  <div id="contact-infos" class="collapse">
    {$contact_infos.address.formatted nofilter}
    {if $contact_infos.phone}
      <br>
      {* [1][/1] is for a HTML tag. *}
      {l s='Call us: [1]%phone%[/1]'
        sprintf=[
        '[1]' => '<span>',
        '[/1]' => '</span>',
        '%phone%' => $contact_infos.phone
        ]
        d='Shop.Theme.Global'
      }
    {/if}
    {if $contact_infos.fax}
      <br>
      {* [1][/1] is for a HTML tag. *}
      {l
        s='Fax: [1]%fax%[/1]'
        sprintf=[
          '[1]' => '<span>',
          '[/1]' => '</span>',
          '%fax%' => $contact_infos.fax
        ]
        d='Shop.Theme.Global'
      }
    {/if}
    {if $contact_infos.email && $display_email}
      <br>
        {l s='Email us:' d='Shop.Theme.Global'}
        {mailto address=$contact_infos.email encode="javascript"}
    {/if}
  </div>
</div>