import { i as init_defineProperty, n as init_objectSpread2, r as _defineProperty, t as _objectSpread2 } from "./objectSpread2-DuxqTrfZ.js";
import { dc as _asyncToGenerator } from "./core-3gb_HddZ.js";
import { C as validateUrl, S as parseForwardedHeader, _ as renderApplication, b as isProxyHeaderAllowed, g as SERVER_CONTEXT, r as InlineCriticalCssProcessor, t as AngularAppEngine, v as renderModule, x as normalizeTrustProxyHeaders, y as getFirstHeaderValue } from "./ssr-CzI97Fga.js";
import * as fs from "node:fs";
import { dirname, join, normalize, resolve } from "node:path";
import { URL as URL$1, fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { argv } from "node:process";
//#region node_modules/@angular/ssr/fesm2022/node.mjs
init_defineProperty();
init_objectSpread2();
function getAllowedHostsFromEnv() {
	return getArrayFromEnv("NG_ALLOWED_HOSTS");
}
function getTrustProxyHeadersFromEnv() {
	return getArrayFromEnv("NG_TRUST_PROXY_HEADERS");
}
function getArrayFromEnv(envName) {
	const envValue = process.env[envName];
	if (!envValue) return;
	const values = [];
	for (const value of envValue.split(",")) {
		const trimmed = value.trim();
		if (trimmed.length > 0) values.push(trimmed);
	}
	return values;
}
function attachNodeGlobalErrorHandlers() {
	if (typeof Zone !== "undefined") return;
	const gThis = globalThis;
	if (gThis.ngAttachNodeGlobalErrorHandlersCalled) return;
	gThis.ngAttachNodeGlobalErrorHandlersCalled = true;
	process.on("unhandledRejection", (error) => console.error("unhandledRejection", error)).on("uncaughtException", (error) => console.error("uncaughtException", error));
}
var CommonEngineInlineCriticalCssProcessor = class {
	constructor() {
		_defineProperty(this, "resourceCache", /* @__PURE__ */ new Map());
	}
	process(html, outputPath) {
		var _this = this;
		return _asyncToGenerator(function* () {
			return new InlineCriticalCssProcessor(function() {
				var _ref = _asyncToGenerator(function* (path) {
					let resourceContent = _this.resourceCache.get(path);
					if (resourceContent === void 0) {
						resourceContent = yield readFile(path, "utf-8");
						_this.resourceCache.set(path, resourceContent);
					}
					return resourceContent;
				});
				return function(_x) {
					return _ref.apply(this, arguments);
				};
			}(), outputPath).process(html);
		})();
	}
};
var PERFORMANCE_MARK_PREFIX = "🅰️";
function printPerformanceLogs() {
	let maxWordLength = 0;
	const benchmarks = [];
	for (const { name, duration } of performance.getEntriesByType("measure")) {
		if (!name.startsWith(PERFORMANCE_MARK_PREFIX)) continue;
		const step = name.slice(4) + ":";
		if (step.length > maxWordLength) maxWordLength = step.length;
		benchmarks.push([step, `${duration.toFixed(1)}ms`]);
		performance.clearMeasures(name);
	}
	console.log("********** Performance results **********");
	for (const [step, value] of benchmarks) {
		const spaces = maxWordLength - step.length + 5;
		console.log(step + " ".repeat(spaces) + value);
	}
	console.log("*****************************************");
}
function runMethodAndMeasurePerf(_x2, _x3) {
	return _runMethodAndMeasurePerf.apply(this, arguments);
}
function _runMethodAndMeasurePerf() {
	_runMethodAndMeasurePerf = _asyncToGenerator(function* (label, asyncMethod) {
		const labelName = `${PERFORMANCE_MARK_PREFIX}:${label}`;
		const startLabel = `start:${labelName}`;
		const endLabel = `end:${labelName}`;
		try {
			performance.mark(startLabel);
			return yield asyncMethod();
		} finally {
			performance.mark(endLabel);
			performance.measure(labelName, startLabel, endLabel);
			performance.clearMarks(startLabel);
			performance.clearMarks(endLabel);
		}
	});
	return _runMethodAndMeasurePerf.apply(this, arguments);
}
function noopRunMethodAndMeasurePerf(label, asyncMethod) {
	return asyncMethod();
}
var SSG_MARKER_REGEXP = /ng-server-context=["']\w*\|?ssg\|?\w*["']/;
var CommonEngine = class {
	constructor(options) {
		var _ref2, _getAllowedHostsFromE, _this$options;
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "templateCache", /* @__PURE__ */ new Map());
		_defineProperty(this, "inlineCriticalCssProcessor", new CommonEngineInlineCriticalCssProcessor());
		_defineProperty(this, "pageIsSSG", /* @__PURE__ */ new Map());
		_defineProperty(this, "allowedHosts", void 0);
		this.options = options;
		this.allowedHosts = new Set((_ref2 = (_getAllowedHostsFromE = getAllowedHostsFromEnv()) !== null && _getAllowedHostsFromE !== void 0 ? _getAllowedHostsFromE : (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.allowedHosts) !== null && _ref2 !== void 0 ? _ref2 : []);
		attachNodeGlobalErrorHandlers();
	}
	render(opts) {
		var _this2 = this;
		return _asyncToGenerator(function* () {
			var _this$options2;
			const { url } = opts;
			if (url && URL$1.canParse(url)) {
				const urlObj = new URL$1(url);
				try {
					validateUrl(urlObj, _this2.allowedHosts);
				} catch (error) {
					console.error(`ERROR: ${error.message}Please provide a list of allowed hosts in the "allowedHosts" option in the "CommonEngine" constructor.`);
					throw error;
				}
			}
			const enablePerformanceProfiler = (_this$options2 = _this2.options) === null || _this$options2 === void 0 ? void 0 : _this$options2.enablePerformanceProfiler;
			const runMethod = enablePerformanceProfiler ? runMethodAndMeasurePerf : noopRunMethodAndMeasurePerf;
			let html = yield runMethod("Retrieve SSG Page", () => _this2.retrieveSSGPage(opts));
			if (html === void 0) {
				html = yield runMethod("Render Page", () => _this2.renderApplication(opts));
				if (opts.inlineCriticalCss !== false) html = yield runMethod("Inline Critical CSS", () => _this2.inlineCriticalCss(html, opts));
			}
			if (enablePerformanceProfiler) printPerformanceLogs();
			return html;
		})();
	}
	inlineCriticalCss(html, opts) {
		var _opts$publicPath;
		const outputPath = (_opts$publicPath = opts.publicPath) !== null && _opts$publicPath !== void 0 ? _opts$publicPath : opts.documentFilePath ? dirname(opts.documentFilePath) : "";
		return this.inlineCriticalCssProcessor.process(html, outputPath);
	}
	retrieveSSGPage(opts) {
		var _this3 = this;
		return _asyncToGenerator(function* () {
			const { publicPath, documentFilePath, url } = opts;
			if (!publicPath || !documentFilePath || url === void 0) return;
			const { pathname } = new URL$1(url, "resolve://");
			const pagePath = join(publicPath, pathname, "index.html");
			if (_this3.pageIsSSG.get(pagePath)) return fs.promises.readFile(pagePath, "utf-8");
			if (!pagePath.startsWith(normalize(publicPath))) return;
			if (pagePath === resolve(documentFilePath) || !(yield exists(pagePath))) return;
			const content = yield fs.promises.readFile(pagePath, "utf-8");
			if (SSG_MARKER_REGEXP.test(content)) {
				_this3.pageIsSSG.set(pagePath, true);
				return content;
			}
		})();
	}
	renderApplication(opts) {
		var _this4 = this;
		return _asyncToGenerator(function* () {
			var _this$options$bootstr, _this$options3, _opts$providers, _this$options$provide, _this$options4;
			const moduleOrFactory = (_this$options$bootstr = (_this$options3 = _this4.options) === null || _this$options3 === void 0 ? void 0 : _this$options3.bootstrap) !== null && _this$options$bootstr !== void 0 ? _this$options$bootstr : opts.bootstrap;
			if (!moduleOrFactory) throw new Error("A module or bootstrap option must be provided.");
			const extraProviders = [
				{
					provide: SERVER_CONTEXT,
					useValue: "ssr"
				},
				...(_opts$providers = opts.providers) !== null && _opts$providers !== void 0 ? _opts$providers : [],
				...(_this$options$provide = (_this$options4 = _this4.options) === null || _this$options4 === void 0 ? void 0 : _this$options4.providers) !== null && _this$options$provide !== void 0 ? _this$options$provide : []
			];
			let document = opts.document;
			if (!document && opts.documentFilePath) document = yield _this4.getDocument(opts.documentFilePath);
			const commonRenderingOptions = {
				url: opts.url,
				document,
				allowedHosts: ["*"]
			};
			return isBootstrapFn(moduleOrFactory) ? renderApplication(moduleOrFactory, _objectSpread2({ platformProviders: extraProviders }, commonRenderingOptions)) : renderModule(moduleOrFactory, _objectSpread2({ extraProviders }, commonRenderingOptions));
		})();
	}
	getDocument(filePath) {
		var _this5 = this;
		return _asyncToGenerator(function* () {
			let doc = _this5.templateCache.get(filePath);
			if (!doc) {
				doc = yield fs.promises.readFile(filePath, "utf-8");
				_this5.templateCache.set(filePath, doc);
			}
			return doc;
		})();
	}
};
function exists(_x4) {
	return _exists.apply(this, arguments);
}
function _exists() {
	_exists = _asyncToGenerator(function* (path) {
		try {
			yield fs.promises.access(path, fs.constants.F_OK);
			return true;
		} catch (_unused) {
			return false;
		}
	});
	return _exists.apply(this, arguments);
}
function isBootstrapFn(value) {
	return typeof value === "function" && !("ɵmod" in value);
}
var HTTP2_PSEUDO_HEADERS = /* @__PURE__ */ new Set([
	":method",
	":scheme",
	":authority",
	":path",
	":status"
]);
function createWebRequestFromNodeRequest(nodeRequest, trustProxyHeaders) {
	const trustProxyHeadersNormalized = normalizeTrustProxyHeaders(trustProxyHeaders);
	const { headers, method = "GET" } = nodeRequest;
	const withBody = method !== "GET" && method !== "HEAD";
	const referrer = headers.referer && URL.canParse(headers.referer) ? headers.referer : void 0;
	const controller = new AbortController();
	if (nodeRequest.aborted) controller.abort();
	else {
		const onAbort = () => controller.abort();
		nodeRequest.once("aborted", onAbort);
		nodeRequest.once("close", () => nodeRequest.off("aborted", onAbort));
	}
	return new Request(createRequestUrl(nodeRequest, trustProxyHeadersNormalized), {
		method,
		signal: controller.signal,
		headers: createRequestHeaders(headers),
		body: withBody ? nodeRequest : void 0,
		duplex: withBody ? "half" : void 0,
		referrer
	});
}
function createRequestHeaders(nodeHeaders) {
	const headers = new Headers();
	for (const [name, value] of Object.entries(nodeHeaders)) {
		if (HTTP2_PSEUDO_HEADERS.has(name)) continue;
		if (typeof value === "string") headers.append(name, value);
		else if (Array.isArray(value)) for (const item of value) headers.append(name, item);
	}
	return headers;
}
function createRequestUrl(nodeRequest, trustProxyHeaders) {
	var _ref3, _forwardedParams$prot, _ref4, _ref5, _forwardedParams$host;
	const { headers, socket, url = "", originalUrl } = nodeRequest;
	const forwardedParams = parseForwardedHeader(getAllowedProxyHeaderValue(headers, "forwarded", trustProxyHeaders));
	const protocol = (_ref3 = (_forwardedParams$prot = forwardedParams.proto) !== null && _forwardedParams$prot !== void 0 ? _forwardedParams$prot : getAllowedProxyHeaderValue(headers, "x-forwarded-proto", trustProxyHeaders)) !== null && _ref3 !== void 0 ? _ref3 : "encrypted" in socket && socket.encrypted ? "https" : "http";
	const hostname = (_ref4 = (_ref5 = (_forwardedParams$host = forwardedParams.host) !== null && _forwardedParams$host !== void 0 ? _forwardedParams$host : getAllowedProxyHeaderValue(headers, "x-forwarded-host", trustProxyHeaders)) !== null && _ref5 !== void 0 ? _ref5 : headers.host) !== null && _ref4 !== void 0 ? _ref4 : headers[":authority"];
	if (Array.isArray(hostname)) throw new Error("host value cannot be an array.");
	let hostnameWithPort = hostname;
	if (!(hostname === null || hostname === void 0 ? void 0 : hostname.includes(":"))) {
		const port = getAllowedProxyHeaderValue(headers, "x-forwarded-port", trustProxyHeaders);
		if (port) hostnameWithPort += `:${port}`;
	}
	return new URL(`${protocol}://${hostnameWithPort}${originalUrl !== null && originalUrl !== void 0 ? originalUrl : url}`);
}
function getAllowedProxyHeaderValue(headers, headerName, trustProxyHeaders) {
	return isProxyHeaderAllowed(headerName, trustProxyHeaders) ? getFirstHeaderValue(headers[headerName]) : void 0;
}
var AngularNodeAppEngine = class {
	constructor(options) {
		var _options$allowedHosts, _options$trustProxyHe;
		_defineProperty(this, "angularAppEngine", void 0);
		_defineProperty(this, "trustProxyHeaders", void 0);
		const appEngineOptions = _objectSpread2(_objectSpread2({}, options), {}, {
			allowedHosts: (_options$allowedHosts = options === null || options === void 0 ? void 0 : options.allowedHosts) !== null && _options$allowedHosts !== void 0 ? _options$allowedHosts : getAllowedHostsFromEnv(),
			trustProxyHeaders: (_options$trustProxyHe = options === null || options === void 0 ? void 0 : options.trustProxyHeaders) !== null && _options$trustProxyHe !== void 0 ? _options$trustProxyHe : getTrustProxyHeadersFromEnv()
		});
		this.angularAppEngine = new AngularAppEngine(appEngineOptions);
		this.trustProxyHeaders = appEngineOptions.trustProxyHeaders;
		attachNodeGlobalErrorHandlers();
	}
	handle(request, requestContext) {
		var _this6 = this;
		return _asyncToGenerator(function* () {
			const webRequest = request instanceof Request ? request : createWebRequestFromNodeRequest(request, _this6.trustProxyHeaders);
			return _this6.angularAppEngine.handle(webRequest, requestContext);
		})();
	}
};
function createNodeRequestHandler(handler) {
	handler["__ng_node_request_handler__"] = true;
	return handler;
}
function isResponseDestroyedOrClosed(destination) {
	return destination.destroyed || destination.closed || destination.writableEnded || "stream" in destination && (!destination.stream || destination.stream.destroyed || destination.stream.closed);
}
function writeResponseToNodeResponse(_x5, _x6) {
	return _writeResponseToNodeResponse.apply(this, arguments);
}
function _writeResponseToNodeResponse() {
	_writeResponseToNodeResponse = _asyncToGenerator(function* (source, destination) {
		if (isResponseDestroyedOrClosed(destination)) return;
		const { status, headers, body } = source;
		destination.statusCode = status;
		let cookieHeaderSet = false;
		for (const [name, value] of headers.entries()) if (name === "set-cookie") {
			if (cookieHeaderSet) continue;
			destination.setHeader(name, headers.getSetCookie());
			cookieHeaderSet = true;
		} else destination.setHeader(name, value);
		if ("flushHeaders" in destination) destination.flushHeaders();
		if (!body) {
			if (!isResponseDestroyedOrClosed(destination)) destination.end();
			return;
		}
		let isClosed = isResponseDestroyedOrClosed(destination);
		const isDestroyedOrClosed = () => isClosed || isResponseDestroyedOrClosed(destination);
		let readerCancelled = false;
		const reader = body.getReader();
		const cancelReader = (error) => {
			if (readerCancelled) return;
			readerCancelled = true;
			isClosed = true;
			destination.off("close", cancelReader);
			destination.off("error", cancelReader);
			reader.cancel(error).catch((err) => {
				console.error(`An error occurred while writing the response body for: ${destination.req.url}.`, err);
			});
		};
		destination.once("close", cancelReader);
		destination.once("error", cancelReader);
		try {
			while (true) {
				if (isDestroyedOrClosed()) {
					cancelReader();
					break;
				}
				const { done, value } = yield reader.read();
				if (isDestroyedOrClosed()) {
					cancelReader();
					break;
				}
				if (done) {
					destination.end();
					break;
				}
				if (destination.write(value) === false) yield new Promise((resolve) => {
					if (isDestroyedOrClosed()) {
						resolve();
						return;
					}
					const onDrain = () => {
						destination.off("close", onClose);
						destination.off("error", onClose);
						resolve();
					};
					const onClose = () => {
						destination.off("drain", onDrain);
						destination.off("close", onClose);
						destination.off("error", onClose);
						cancelReader();
						resolve();
					};
					destination.once("drain", onDrain);
					destination.once("close", onClose);
					destination.once("error", onClose);
				});
			}
		} catch (_unused2) {
			if (!isDestroyedOrClosed()) destination.end("Internal server error.");
		} finally {
			destination.off("close", cancelReader);
			destination.off("error", cancelReader);
		}
	});
	return _writeResponseToNodeResponse.apply(this, arguments);
}
function isMainModule(url) {
	return url.startsWith("file:") && argv[1] === fileURLToPath(url);
}
//#endregion
export { AngularNodeAppEngine, CommonEngine, createNodeRequestHandler, createWebRequestFromNodeRequest, isMainModule, writeResponseToNodeResponse };
