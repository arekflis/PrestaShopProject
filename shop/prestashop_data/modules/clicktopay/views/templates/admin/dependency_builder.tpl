{**
 * NOTICE OF LICENSE
 *
 * @author    Mastercard Inc. www.mastercard.com
 * @copyright Copyright (c) permanent, Mastercard Inc.
 * @license   Apache-2.0
 *
 * @see       /LICENSE
 *
 * International Registered Trademark & Property of Mastercard Inc.
 *}

<!-- Load cdc library -->
<script src="https://assets.prestashop3.com/dst/mbo/v1/mbo-cdc-dependencies-resolver.umd.js"></script>

<!-- cdc container -->
<div id="cdc-container" style="margin-top:50px;"></div>

<script defer>
    const renderMboCdcDependencyResolver = window.mboCdcDependencyResolver.render
    const context = {
        ...{$dependencies|json_encode},
        onDependenciesResolved: () => location.reload(),
        onDependencyResolved: (dependencyData) => console.log('Dependency installed', dependencyData), // name, displayName, version
        onDependencyFailed: (dependencyData) => console.log('Failed to install dependency', dependencyData),
        onDependenciesFailed: () => console.log('There are some errors'),
    }
    renderMboCdcDependencyResolver(context, '#cdc-container')
</script>
