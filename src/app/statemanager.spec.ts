import { IStateManager, StateManager } from "./statemanager";
import { setupMaster } from "cluster";

describe("helpers/statemanager", () => {

  let _window: WindowMock = null;
  let _stateManager: IStateManager = null;
  let _thenValue: any = null;

  let _setup: (cache: any) => void = (cache: any) : void => {
    _window = new WindowMock(cache);
    _stateManager = new StateManager(<Window>_window);
    spyOn(console, "log");
  };

  let _teardown: () => void = () : void => {
    _window = null;
    _stateManager = null;
    _thenValue = null;
  };

  let _givenLocalStorageUndefined: () => void = () : void => {
    _stateManager = new StateManager({});
  };

  let _whenGetValue: (id: string, property: string, defaultValue: any) => void = (id: string, property: string, defaultValue: any) : void => {
    _thenValue = _stateManager.GetValue(id, property, defaultValue);
  };

  let _whenSetValue: (id: string, property: string, value: any) => void = (id: string, property: string, value: any) : void => {
    _stateManager.SetValue(id, property, value);
  };

  it("should be instantiated", () => {
    _setup({});
    expect(_stateManager).toBeTruthy();
    _teardown();
  });

  it("should log to console if localStorage not available, should not throw error", () => {
    _setup({});
    _givenLocalStorageUndefined();
    _whenGetValue("SomeID", "SomeProperty", "SomeDefaultValue");
    expect(_thenValue).toBe("SomeDefaultValue");
    _whenSetValue("SomeID", "SomeProperty", "SomeValue");
    _whenGetValue("SomeID", "SomeProperty", "");
    expect(_thenValue).toBe("SomeValue");
    expect(console.log).toHaveBeenCalledWith("localStorage unavailable");
    _teardown();
  });

  it("should pull cached data from localStorage", () => {
    _setup({StateManager: "{\"SomeID\":{\"SomeProperty\":\"SomeValue\"}}"});
    expect(_stateManager.CurrentState.SomeID.SomeProperty).toBe("SomeValue");
    _teardown();
  });

  describe("GetValue", () => {

    it("should return default value if requested value not cached", () => {
      _setup({});
      _whenGetValue("SomeID", "SomeProperty", "SomeDefaultValue");
      expect(_thenValue).toBe("SomeDefaultValue");
      _teardown();
    });

    it("should return cached value", () => {
      _setup({StateManager: "{\"SomeID\":{\"SomeProperty\":\"SomeValue\"}}"});
      _whenGetValue("SomeID", "SomeProperty", "");
      expect(_thenValue).toBe("SomeValue");
      _teardown();
    });

  });

  describe("SetValue", () => {

    it("should cache value in localStorage", () => {
      _setup({});
      _whenSetValue("SomeID", "SomeProperty", "SomeValue");
      expect(_stateManager.CurrentState).toEqual({SomeID: {SomeProperty: "SomeValue"}});
      expect(_window.localStorage).toEqual({StateManager: "{\"SomeID\":{\"SomeProperty\":\"SomeValue\"}}"});
      _teardown();
    });

  });

});

class WindowMock {
  localStorage: any;
  constructor (cache: any) {
    this.localStorage = cache;
  }
}