/**
 * @type {SeriousGameTracker}
 */
var xapiTracker = new SeriousGameTracker();
xapiTracker.trackerSettings.default_uri="ConectadoWeb";
xapiTracker.trackerSettings.generateSettingsFromURLParams=true;
await xapiTracker.Login();
xapiTracker.Start();
export default xapiTracker;