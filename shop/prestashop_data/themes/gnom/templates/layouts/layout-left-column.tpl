{extends file='layouts/layout-both-columns.tpl'}

{block name='right_column'}{/block}
{if $page.page_name == 'category'}
    {block name='content_wrapper'}
    <div id="content-wrapper" class="js-content-wrapper categories-wrapper">
        {hook h="displayContentWrapperTop"}
        {block name='content'}
        <p>Hello world! This is HTML5 Boilerplate.</p>
        {/block}
        {hook h="displayContentWrapperBottom"}
    </div>
    {/block}
{else}
    {block name='content_wrapper'}
    <div id="content-wrapper" class="js-content-wrapper left-column col-xs-12 col-sm-8 col-md-9">
        {hook h="displayContentWrapperTop"}
        {block name='content'}
        <p>Hello world! This is HTML5 Boilerplate.</p>
        {/block}
        {hook h="displayContentWrapperBottom"}
    </div>
    {/block}
{/if}