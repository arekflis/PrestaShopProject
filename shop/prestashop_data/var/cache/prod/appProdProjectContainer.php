<?php

// This file has been auto-generated by the Symfony Dependency Injection Component for internal use.

if (\class_exists(\ContainerOoq7piw\appProdProjectContainer::class, false)) {
    // no-op
} elseif (!include __DIR__.'/ContainerOoq7piw/appProdProjectContainer.php') {
    touch(__DIR__.'/ContainerOoq7piw.legacy');

    return;
}

if (!\class_exists(appProdProjectContainer::class, false)) {
    \class_alias(\ContainerOoq7piw\appProdProjectContainer::class, appProdProjectContainer::class, false);
}

return new \ContainerOoq7piw\appProdProjectContainer([
    'container.build_hash' => 'Ooq7piw',
    'container.build_id' => '96544b8e',
    'container.build_time' => 1729702878,
], __DIR__.\DIRECTORY_SEPARATOR.'ContainerOoq7piw');
