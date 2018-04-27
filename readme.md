# angular-statemanager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.4
and is packaged using [ng-packagr](https://github.com/dherges/ng-packagr) version 2.4.2. It provides an
injectable class (service) that can be used in Angular projects to keep track of state in HTML controls,
e.g. the current page of a data grid. It uses `window.localStorage` to cache state data, so it won't work
in browsers that don't support localStorage (but it won't break anything).

## Building the package

`git clone https://github.com/lkmylin/angular-statemanager <my-directory>`

`cd <my-directory>`

`npm install`

`npm run packagr`

After the build completes, output will be available in the `angular-statemanager` subdirectory.

## Installation from npm

`npm install @lkmylin/angular-statemanager`

## Implementation

In your bootstrap module:

* `import { StateManagerModule, StateManager } from "@lkmylin/angular-statemanager";`

* add `StateManager` to your providers

* add `{provide: "window", useValue: window}` to your providers

* inject an instance where needed

* use `stateManager.SetValue(id, property, value)` to cache a value

    * id is the control's unique ID

    * property is the property you want to cache, e.g. currentPage

    * value is the object you want to cache

* use `stateManager.GetValue(id, property, defaultValue)` to retrieve a value from the cache

    * id is the control's unique ID

    * property is the property you want to retrieve, e.g. currentPage

    * default value is the default value to use in case the id:property pair you are looking for isn't cached
      or the user has cleared their browsing history, etc.

* if you want to see the entire contents of the cache, use `stateManager.CurrentState`