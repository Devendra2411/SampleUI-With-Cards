# Helpers

A series of helper classes to use arbitrarily in Predix Experience.

## Demo

You can review the use of some helper classes here: https://github.build.ge.com/pages/PXd/px-helpers-design

## Sass Documentation

You can review Sass Documentation here: https://github.build.ge.com/pages/PXd/px-helpers-design/sassdoc

## Dependencies

Px's Helpers module depends on one other Px and one other inuitcss modules:

* [tools.responsive](https://github.com/inuitcss/tools.responsive)
* [px-functions-design](https://github.build.ge.com/PXd/px-functions-design)

## Upstream dependency

The Helpers module is also an upstream dependency in this meta kit:

* [px-starter-kit-design](https://github.build.ge.com/PXd/px-starter-kit-design)

## Installation

Install this module and its dependencies using bower:

    bower install --save https://github.build.ge.com/PXd/px-helpers-design.git

Once installed, `@import` into your project's Sass file in its Generic layer:

    @import "px-helpers-design/_generic.helpers.scss";

## Usage

Only use a helper class if an element/component doesn’t already have a class to which you could apply this styling, e.g. if you need to float `.main-nav` left then add `float:left;` to that ruleset as opposed to adding the `.float--left` class to the markup.

A lot of these classes carry `!important` as you will always want them to win out over other selectors.
