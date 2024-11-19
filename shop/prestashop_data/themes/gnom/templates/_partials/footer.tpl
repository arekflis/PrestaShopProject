{*<div class="container">
  <div class="row">
    {block name='hook_footer_before'}
      {hook h='displayFooterBefore'}
    {/block}
  </div>
</div>
<div class="footer-container">
  <div class="container">
    <div class="row">
      {block name='hook_footer'}
        {hook h='displayFooter'}
      {/block}
    </div>
    <div class="row">
      {block name='hook_footer_after'}
        {hook h='displayFooterAfter'}
      {/block}
    </div>
    <div class="row">
      <div class="col-md-12">
        <p class="text-sm-center">
          {block name='copyright_link'}
            <a href="https://www.prestashop.com" target="_blank" rel="noopener noreferrer nofollow">
              {l s='%copyright% %year% - Ecommerce software by %prestashop%' sprintf=['%prestashop%' => 'PrestaShop™', '%year%' => 'Y'|date, '%copyright%' => '©'] d='Shop.Theme.Global'}
            </a>
          {/block}
        </p>
      </div>
    </div>
  </div>
</div>}*}


{* Temporary link *}
{assign var="placeholder_link" value="javascript:void(0)"}


<div id="footer-div">
    <div id="information-div">
        <div id='footer-zamowienia-konto'>
            <div class="footer-table-div">
                <h3>Zamówienia</h3>
                <table id="table-zamowienia">
                <tr>
                    <td>
                    <span class="material-symbols-outlined">line_start</span>
                      <a href="https://localhost:8443/index.php?controller=history">Status zamówienia</a>
                    </td>
                    <td class="td-right">
                    <i class="material-icons local_shipping">local_shipping</i>
                    <a href="https://localhost:8443/index.php?id_cms=1&controller=cms">Śledzenie przesyłki</a>
                    </td>
                </tr>
                <tr>
                    <td>
                    <i class="material-icons sentiment_dissatisfied">sentiment_dissatisfied</i>
                    <a href="https://localhost:8443/index.php?controller=order-slip">Chcę zareklamować produkt</a>
                    </td>
                    <td class="td-right">
                    <span class="material-symbols-outlined">currency_exchange</span>
                    <a href="https://localhost:8443/index.php?controller=order-slip">Chcę zwrócić produkt</a>
                    </td>
                </tr>
                <tr>
                    <td>
                    <span class="material-symbols-outlined">quick_reorder</span>
                    <a href="https://localhost:8443/index.php?controller=order-slip">Chcę wymienić produkt</a>
                    </td>
                    <td class="td-right">
                    <i class="material-icons call">call</i>
                    <a href="{$placeholder_link}">Kontakt</a>
                    </td>
                </tr>
              </table>
            </div>
            </div>
            <div class="footer-table-div">
                <h3>Konto</h3>
                <table id="table-konto">
                <tr>
                    <td>
                    <span class="material-symbols-outlined">edit_square</span>
                    <a href="https://localhost:8443/index.php?controller=authentication&create_account">Zarejestruj się</a>
                    </td>
                    <td class="td-right">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <a href="https://localhost:8443/index.php?controller=cart&action=show">Koszyk</a>
                    </td>
                </tr>
                <tr>
                    <td>
                    <span class="material-symbols-outlined">star</span>
                    <a href="{$placeholder_link}">Listy zakupowe</a>
                    </td>
                    <td class="td-right">
                    <span class="material-symbols-outlined">list_alt</span>
                    <a href="https://localhost:8443/index.php?controller=history">Lista zakupionych produktów</a>
                    </td>
                </tr>
                <tr>
                    <td>
                    <span class="material-symbols-outlined">schedule</span>
                    <a href="https://localhost:8443/index.php?controller=history">Historia transakcji</a>
                    </td>
                    <td class="td-right">
                    <span class="material-symbols-outlined">content_cut</span>
                    <a href="{$placeholder_link}">Moje rabaty</a>
                    </td>
                </tr>
                <tr>
                    <td>
                    <span class="material-symbols-outlined">mail</span>
                    <a href="{$placeholder_link}">Newsletter</a>
                    </td>
                </tr>
                </table>
            </div>
        </div>

  <div id='client-information'>
    <div class="footer-table-div">
      <table id='regulaminy'>
      <h3>Regulaminy</h3>
        <tr>
        <td>
          <a href="https://localhost:8443/index.php?id_cms=4&controller=cms">Informacje o sklepie</a>
        </td>
        <td class="td-right-regulaminy">
          <a href="https://localhost:8443/index.php?id_cms=1&controller=cms">Wysyłka</a>
        </td>
        </tr>
        <tr>
        <td>
          <a href="{$placeholder_link}">Sposoby płatności i prowizje</a>
        </td>
        <td class="td-right-regulaminy">
          <a href="{$placeholder_link}">Regulamin</a>
        </td>
        </tr>
        <tr>
        <td>
          <a href="{$placeholder_link}">Polityka prywatności</a>
        </td>
        <td class="td-right-regulaminy">
          <a href="{$placeholder_link}">Odstąpienie od umowy</a>
        </td>
        </tr>
        <tr>
        <td>
        <a href="{$placeholder_link}">Zarządzaj plikami cookie</a>
        </td>
        </tr>
      </table>
    </div>
  </div>
    </div>
    <div id='idosell-div'>
      <p>W sklepie prezentujemy ceny brutto (z VAT)</p>
      <span id="footer-line"></span>
      <img src="https://localhost:8443/img/cms/poweredby_IdoSell_Shop_black.png">
    </div>
    <div id="footer-contact-info">
      <a href="tel:+48660527787">+48 660 527 787</a>
      <a href="mailto:sklep.gnom@gmail.com">sklep.gnom@gmail.com</a>
      <p>Sklep GNOM, Szkolna 15A, 43-300 Bielsko-Biała</p>
    </div>
</div>

{* Default links *}
 {*widget name='ps_contactinfo'*}
        {*widget name='ps_customeraccountlinks'*}

{*hook h='displayFooter'*}