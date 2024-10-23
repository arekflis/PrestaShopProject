<?php
/* Smarty version 3.1.48, created on 2024-10-23 19:02:15
  from '/var/www/html/admin8221h7ycl/themes/default/template/content.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.48',
  'unifunc' => 'content_67192c17dc2f55_61183961',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'b8f143ba865858f053aa390922e4ad4ef2ab6411' => 
    array (
      0 => '/var/www/html/admin8221h7ycl/themes/default/template/content.tpl',
      1 => 1702485415,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_67192c17dc2f55_61183961 (Smarty_Internal_Template $_smarty_tpl) {
?><div id="ajax_confirmation" class="alert alert-success hide"></div>
<div id="ajaxBox" style="display:none"></div>

<div class="row">
	<div class="col-lg-12">
		<?php if ((isset($_smarty_tpl->tpl_vars['content']->value))) {?>
			<?php echo $_smarty_tpl->tpl_vars['content']->value;?>

		<?php }?>
	</div>
</div>
<?php }
}
