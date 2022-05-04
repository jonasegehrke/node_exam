
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop$1;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop$1;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop$1, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction$1 = value => typeof value === "function";

    const isNumber$1 = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener$1(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction$1(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve$1(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve$1(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener$1(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber$1(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener$1(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.47.0 */

    const file$g = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$8(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$g, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$g, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$j($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber$1(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.47.0 */
    const file$f = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes$2 = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context$2 = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$7(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context$2);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes$2),
    						get_default_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$f, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$f, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$i($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.47.0 */
    const file$e = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$h(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$e, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction: isFunction$1,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction$1(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    function notificationsStore(initialValue = []) {
      const store = writable(initialValue);
      const { set, update, subscribe } = store;
      let defaultOptions = {
        duration: 3000,
        placement: 'bottom-right',
        type: 'info',
        theme: 'dark',
      };
      function add(options) {
        const {
          duration = 3000,
          placement = 'bottom-right',
          type = 'info',
          theme = 'dark',
          ...rest
        } = { ...defaultOptions, ...options };

        const uid = Date.now();
        const obj = {
          ...rest,
          uid,
          placement,
          type,
          theme,
          duration,
          remove: () => {
            update((v) => v.filter((i) => i.uid !== uid));
          },
          update: (data) => {
            delete data.uid;
            const index = get_store_value(store)?.findIndex((v) => v?.uid === uid);
            if (index > -1) {
              update((v) => [
                ...v.slice(0, index),
                { ...v[index], ...data },
                ...v.slice(index + 1),
              ]);
            }
          },
        };
        update((v) => [...v, obj]);
        if (duration > 0) {
          setTimeout(() => {
            obj.remove();
            if (typeof obj.onRemove === 'function') obj.onRemove();
          }, duration);
        }
        return obj;
      }

      function getById(uid) {
        return get_store_value(store)?.find((v) => v?.uid === uid);
      }

      function clearAll() {
        set([]);
      }
      function clearLast() {
        update((v) => {
          return v.slice(0, v.length - 1);
        });
      }

      function setDefaults(options) {
        defaultOptions = { ...defaultOptions, ...options };
      }

      return {
        subscribe,
        add,
        success: getHelper('success', add),
        info: getHelper('info', add),
        error: getHelper('error', add),
        warning: getHelper('warning', add),
        clearAll,
        clearLast,
        getById,
        setDefaults,
      };
    }
    const toasts = notificationsStore([]);

    function getHelper(type, add) {
      return function () {
        if (typeof arguments[0] === 'object') {
          const options = arguments[0];
          return add({ ...options, type });
        } else if (
          typeof arguments[0] === 'string' &&
          typeof arguments[1] === 'string'
        ) {
          const options = arguments[2] || {};
          return add({
            ...options,
            type,
            title: arguments[0],
            description: arguments[1],
          });
        } else if (typeof arguments[0] === 'string') {
          const options = arguments[1] || {};
          return add({
            ...options,
            type,
            description: arguments[0],
          });
        }
      };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* node_modules\svelte-toasts\src\ToastContainer.svelte generated by Svelte v3.47.0 */
    const file$d = "node_modules\\svelte-toasts\\src\\ToastContainer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes$1 = dirty => ({ data: dirty & /*$toasts*/ 4 });
    const get_default_slot_context$1 = ctx => ({ data: /*toast*/ ctx[14] });

    // (107:10) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $toasts*/ 516)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(107:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:10) {#if toast.component}
    function create_if_block$6(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*toast*/ ctx[14].component;

    	function switch_props(ctx) {
    		return {
    			props: { data: /*toast*/ ctx[14] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*$toasts*/ 4) switch_instance_changes.data = /*toast*/ ctx[14];

    			if (switch_value !== (switch_value = /*toast*/ ctx[14].component)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(105:10) {#if toast.component}",
    		ctx
    	});

    	return block;
    }

    // (97:6) {#each $toasts         .filter((n) => n.placement === placement)         .reverse() as toast (toast.uid)}
    function create_each_block_1(key_1, ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop$1;
    	let current;
    	const if_block_creators = [create_if_block$6, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*toast*/ ctx[14].component) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			attr_dev(li, "class", "svelte-1rg6zyw");
    			add_location(li, file$d, 99, 8, 2256);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(li, t);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fade, { duration: 500 });
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (li_intro) li_intro.invalidate();

    			li_outro = create_out_transition(li, fly, {
    				y: /*flyMap*/ ctx[4][/*toast*/ ctx[14].placement],
    				duration: 1000
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(97:6) {#each $toasts         .filter((n) => n.placement === placement)         .reverse() as toast (toast.uid)}",
    		ctx
    	});

    	return block;
    }

    // (94:0) {#each placements as placement}
    function create_each_block$2(ctx) {
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[11](/*placement*/ ctx[1], ...args);
    	}

    	let each_value_1 = /*$toasts*/ ctx[2].filter(func).reverse();
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*toast*/ ctx[14].uid;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(ul, "class", "svelte-1rg6zyw");
    			add_location(ul, file$d, 95, 4, 2131);
    			attr_dev(div, "class", "toast-container " + /*placement*/ ctx[1] + " svelte-1rg6zyw");
    			set_style(div, "width", /*width*/ ctx[0]);
    			add_location(div, file$d, 94, 2, 2062);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*flyMap, $toasts, placements, $$scope*/ 540) {
    				each_value_1 = /*$toasts*/ ctx[2].filter(func).reverse();
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(94:0) {#each placements as placement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*placements*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placements, width, $toasts, flyMap, $$scope*/ 541) {
    				each_value = /*placements*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $toasts;
    	validate_store(toasts, 'toasts');
    	component_subscribe($$self, toasts, $$value => $$invalidate(2, $toasts = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastContainer', slots, ['default']);
    	let { theme = 'dark' } = $$props;
    	let { placement = 'bottom-right' } = $$props;
    	let { type = 'info' } = $$props;
    	let { showProgress = false } = $$props;
    	let { duration = 3000 } = $$props;
    	let { width = '320px' } = $$props;

    	/**
     * Default slot which is Toast component/template which will get toast data
     * @slot {{ data: ToastProps }}
     */
    	const placements = [
    		'bottom-right',
    		'bottom-left',
    		'top-right',
    		'top-left',
    		'top-center',
    		'bottom-center',
    		'center-center'
    	];

    	const flyMap = {
    		'bottom-right': 400,
    		'top-right': -400,
    		'bottom-left': 400,
    		'top-left': -400,
    		'bottom-center': 400,
    		'top-center': -400,
    		'center-center': -800
    	};

    	onMount(() => {
    		toasts.setDefaults({
    			placement,
    			showProgress,
    			theme,
    			duration,
    			type
    		});
    	});

    	const writable_props = ['theme', 'placement', 'type', 'showProgress', 'duration', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastContainer> was created with unknown prop '${key}'`);
    	});

    	const func = (placement, n) => n.placement === placement;

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(5, theme = $$props.theme);
    		if ('placement' in $$props) $$invalidate(1, placement = $$props.placement);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('showProgress' in $$props) $$invalidate(7, showProgress = $$props.showProgress);
    		if ('duration' in $$props) $$invalidate(8, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		onMount,
    		flip,
    		toasts,
    		theme,
    		placement,
    		type,
    		showProgress,
    		duration,
    		width,
    		placements,
    		flyMap,
    		$toasts
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(5, theme = $$props.theme);
    		if ('placement' in $$props) $$invalidate(1, placement = $$props.placement);
    		if ('type' in $$props) $$invalidate(6, type = $$props.type);
    		if ('showProgress' in $$props) $$invalidate(7, showProgress = $$props.showProgress);
    		if ('duration' in $$props) $$invalidate(8, duration = $$props.duration);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		placement,
    		$toasts,
    		placements,
    		flyMap,
    		theme,
    		type,
    		showProgress,
    		duration,
    		$$scope,
    		slots,
    		func
    	];
    }

    class ToastContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			theme: 5,
    			placement: 1,
    			type: 6,
    			showProgress: 7,
    			duration: 8,
    			width: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastContainer",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get theme() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProgress() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProgress(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules\svelte-toasts\src\FlatToast.svelte generated by Svelte v3.47.0 */
    const file$c = "node_modules\\svelte-toasts\\src\\FlatToast.svelte";
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});
    const get_extra_slot_changes = dirty => ({});
    const get_extra_slot_context = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (92:4) {:else}
    function create_else_block$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$c, 99, 9, 2534);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$c, 101, 10, 2690);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 92, 6, 2353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(92:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:36) 
    function create_if_block_4(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			add_location(path0, file$c, 83, 9, 2085);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$c, 85, 10, 2196);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 76, 6, 1904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(76:36) ",
    		ctx
    	});

    	return block;
    }

    // (64:35) 
    function create_if_block_3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z");
    			add_location(path, file$c, 71, 9, 1681);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 64, 6, 1500);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(64:35) ",
    		ctx
    	});

    	return block;
    }

    // (45:4) {#if data.type === 'success'}
    function create_if_block_2(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			add_location(path0, file$c, 53, 8, 1135);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$c, 56, 8, 1279);
    			attr_dev(svg, "class", "st-toast-icon svelte-is9c7e");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 45, 6, 947);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(45:4) {#if data.type === 'success'}",
    		ctx
    	});

    	return block;
    }

    // (44:20)      
    function fallback_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[1].type === 'success') return create_if_block_2;
    		if (/*data*/ ctx[1].type === 'info') return create_if_block_3;
    		if (/*data*/ ctx[1].type === 'error') return create_if_block_4;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(44:20)      ",
    		ctx
    	});

    	return block;
    }

    // (112:4) {#if data.title}
    function create_if_block_1$1(ctx) {
    	let h3;
    	let t_value = /*data*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "st-toast-title svelte-is9c7e");
    			add_location(h3, file$c, 112, 6, 2954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = /*data*/ ctx[1].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(112:4) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (127:28)        
    function fallback_block(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$c, 135, 8, 3504);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-is9c7e");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$c, 127, 6, 3295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(127:28)        ",
    		ctx
    	});

    	return block;
    }

    // (142:2) {#if data.showProgress}
    function create_if_block$5(ctx) {
    	let progress_1;

    	const block = {
    		c: function create() {
    			progress_1 = element("progress");
    			set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? '4px' : 0);
    			progress_1.value = /*$progress*/ ctx[2];
    			attr_dev(progress_1, "class", "svelte-is9c7e");
    			add_location(progress_1, file$c, 142, 4, 3699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, progress_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2) {
    				set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? '4px' : 0);
    			}

    			if (dirty & /*$progress*/ 4) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(progress_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(142:2) {#if data.showProgress}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let t1;
    	let p;
    	let t2_value = /*data*/ ctx[1].description + "";
    	let t2;
    	let t3;
    	let div0;
    	let t4;
    	let button;
    	let t5;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[7].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[6], get_icon_slot_context);
    	const icon_slot_or_fallback = icon_slot || fallback_block_1(ctx);
    	let if_block0 = /*data*/ ctx[1].title && create_if_block_1$1(ctx);
    	const extra_slot_template = /*#slots*/ ctx[7].extra;
    	const extra_slot = create_slot(extra_slot_template, ctx, /*$$scope*/ ctx[6], get_extra_slot_context);
    	const close_icon_slot_template = /*#slots*/ ctx[7]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[6], get_close_icon_slot_context);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block(ctx);
    	let if_block1 = /*data*/ ctx[1].showProgress && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			if (extra_slot) extra_slot.c();
    			t4 = space();
    			button = element("button");
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(p, "class", "st-toast-description svelte-is9c7e");
    			add_location(p, file$c, 115, 4, 3014);
    			attr_dev(div0, "class", "st-toast-extra");
    			add_location(div0, file$c, 116, 4, 3073);
    			attr_dev(div1, "class", "st-toast-details svelte-is9c7e");
    			add_location(div1, file$c, 110, 2, 2896);
    			attr_dev(button, "class", "st-toast-close-btn svelte-is9c7e");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$c, 120, 2, 3152);
    			attr_dev(div2, "class", div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || 'info') + " svelte-is9c7e");
    			attr_dev(div2, "role", "alert");
    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "aria-atomic", "true");
    			add_location(div2, file$c, 36, 0, 730);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(div2, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);

    			if (extra_slot) {
    				extra_slot.m(div0, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, button);

    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(button, null);
    			}

    			append_dev(div2, t5);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*onRemove*/ ctx[4], false, false, false),
    					listen_dev(div2, "click", /*onClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[6], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty & /*data*/ 2)) {
    					icon_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (/*data*/ ctx[1].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*data*/ 2) && t2_value !== (t2_value = /*data*/ ctx[1].description + "")) set_data_dev(t2, t2_value);

    			if (extra_slot) {
    				if (extra_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						extra_slot,
    						extra_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(extra_slot_template, /*$$scope*/ ctx[6], dirty, get_extra_slot_changes),
    						get_extra_slot_context
    					);
    				}
    			}

    			if (close_icon_slot) {
    				if (close_icon_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						close_icon_slot,
    						close_icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(close_icon_slot_template, /*$$scope*/ ctx[6], dirty, get_close_icon_slot_changes),
    						get_close_icon_slot_context
    					);
    				}
    			}

    			if (/*data*/ ctx[1].showProgress) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*data, theme*/ 3 && div2_class_value !== (div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || 'info') + " svelte-is9c7e")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			transition_in(extra_slot, local);
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			transition_out(extra_slot, local);
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			if (if_block0) if_block0.d();
    			if (extra_slot) extra_slot.d(detaching);
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FlatToast', slots, ['icon','extra','close-icon']);
    	let { theme = 'light' } = $$props;
    	let { data = {} } = $$props;
    	const progress = tweened(1, { duration: data.duration, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(2, $progress = value));

    	onMount(() => {
    		progress.set(0, { duration: data.duration });
    	});

    	const onRemove = e => {
    		e.stopPropagation();
    		data.remove();
    		if (typeof data.onRemove === 'function') data.onRemove();
    	};

    	const onClick = () => {
    		if (typeof data.onClick === 'function') data.onClick();
    	};

    	const writable_props = ['theme', 'data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FlatToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tweened,
    		linear: identity,
    		theme,
    		data,
    		progress,
    		onRemove,
    		onClick,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, data, $progress, progress, onRemove, onClick, $$scope, slots];
    }

    class FlatToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { theme: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatToast",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get theme() {
    		throw new Error("<FlatToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<FlatToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<FlatToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FlatToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const responseData = writable(null);

    const storedLoggedIn = localStorage.getItem("loggedIn");
    const loggedIn = storedLoggedIn === "true" ? true : false;
    const isLoggedIn = writable(loggedIn);
    isLoggedIn.subscribe((value) => {
      localStorage.setItem("loggedIn", value);
    });

    const storedUserId = localStorage.getItem("userId");
    const setUserId = storedUserId === null ? null : Number(storedUserId);
    const userId = writable(setUserId);
    userId.subscribe((value) => {
      localStorage.setItem("userId", value);
    });



    const storedStudentData = localStorage.getItem("studentData");
    const setStudentData = storedStudentData === null ? null : JSON.parse(storedStudentData); 
      const studentData = writable(setStudentData);
       studentData.subscribe((value) => {
        localStorage.setItem("studentData", JSON.stringify(value));
      }); 


    const posts = writable([]);



    const students = writable([]);

    /* src\pages\Login\Login.svelte generated by Svelte v3.47.0 */
    const file$b = "src\\pages\\Login\\Login.svelte";

    function create_fragment$e(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t1;
    	let p;
    	let t3;
    	let div1;
    	let h2;
    	let t5;
    	let input0;
    	let t6;
    	let input1;
    	let t7;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "PrettyIntra";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Bedste skoleintra i landet.";
    			t3 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Log ind";
    			t5 = space();
    			input0 = element("input");
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			button = element("button");
    			button.textContent = "Log ind";
    			attr_dev(h1, "class", "logo svelte-gig8nb");
    			add_location(h1, file$b, 54, 6, 1494);
    			attr_dev(p, "class", "catchphrase svelte-gig8nb");
    			add_location(p, file$b, 55, 6, 1535);
    			attr_dev(div0, "class", "heading-container svelte-gig8nb");
    			add_location(div0, file$b, 53, 4, 1455);
    			attr_dev(h2, "class", "form-heading svelte-gig8nb");
    			add_location(h2, file$b, 59, 6, 1646);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "username svelte-gig8nb");
    			attr_dev(input0, "id", "username");
    			attr_dev(input0, "placeholder", "Brugernavn");
    			input0.required = true;
    			add_location(input0, file$b, 60, 6, 1691);
    			attr_dev(input1, "type", "password");
    			attr_dev(input1, "class", "password svelte-gig8nb");
    			attr_dev(input1, "id", "password");
    			attr_dev(input1, "placeholder", "Adgangskode");
    			add_location(input1, file$b, 69, 6, 1927);
    			attr_dev(button, "class", "login-btn svelte-gig8nb");
    			add_location(button, file$b, 76, 6, 2094);
    			attr_dev(div1, "class", "login-container svelte-gig8nb");
    			add_location(div1, file$b, 58, 4, 1609);
    			attr_dev(div2, "class", "content svelte-gig8nb");
    			add_location(div2, file$b, 52, 2, 1428);
    			attr_dev(div3, "class", "welcome-container svelte-gig8nb");
    			add_location(div3, file$b, 51, 0, 1393);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(div1, t5);
    			append_dev(div1, input0);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			append_dev(div1, t7);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "keypress", /*onKeyPress*/ ctx[2], false, false, false),
    					listen_dev(input1, "keypress", /*onKeyPress*/ ctx[2], false, false, false),
    					listen_dev(button, "click", /*handleLogin*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $responseData;
    	let $location;
    	let $isLoggedIn;
    	validate_store(responseData, 'responseData');
    	component_subscribe($$self, responseData, $$value => $$invalidate(3, $responseData = $$value));
    	validate_store(isLoggedIn, 'isLoggedIn');
    	component_subscribe($$self, isLoggedIn, $$value => $$invalidate(5, $isLoggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Login', slots, []);
    	const navigate = useNavigate();
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	async function handleLogin() {
    		const username = document.getElementById("username").value;
    		const password = document.getElementById("password").value;
    		const url = `http://localhost:3000/api/auth`;

    		if (username === "" || password === "") {
    			toasts.error("Udfyld venligst både brugernavn og password");
    			return;
    		}

    		const data = { username, password };

    		await fetch(url, {
    			method: "POST",
    			body: JSON.stringify(data),
    			headers: {
    				"Content-type": "application/json; charset=UTF-8"
    			}
    		}).then(response => response.json()).then(data => {
    			isLoggedIn.set(data.isLoggedIn);
    			userId.set(data.userId);
    			responseData.set(data);
    		});

    		if ($isLoggedIn) {
    			toasts.success("Du er nu logget ind");

    			navigate("/", {
    				state: { from: $location.pathname },
    				replace: true
    			});
    		} else {
    			toasts.error($responseData.message);
    		}
    	}

    	const onKeyPress = e => {
    		if (e.charCode === 13) {
    			handleLogin();
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Login> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		isLoggedIn,
    		userId,
    		responseData,
    		useNavigate,
    		useLocation,
    		toasts,
    		navigate,
    		location,
    		handleLogin,
    		onKeyPress,
    		$responseData,
    		$location,
    		$isLoggedIn
    	});

    	return [location, handleLogin, onKeyPress];
    }

    class Login extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Login",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\Post.svelte generated by Svelte v3.47.0 */

    const file$a = "src\\components\\Post.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1;
    	let h4;
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let t5;
    	let p1;
    	let t6;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			h4 = element("h4");
    			t2 = text(/*creator*/ ctx[2]);
    			t3 = space();
    			p0 = element("p");
    			t4 = text(/*content*/ ctx[1]);
    			t5 = space();
    			p1 = element("p");
    			t6 = text(/*timestamp*/ ctx[3]);
    			attr_dev(h3, "id", "title");
    			attr_dev(h3, "class", "svelte-6kads1");
    			add_location(h3, file$a, 8, 2, 147);
    			attr_dev(h4, "id", "creator");
    			attr_dev(h4, "class", "svelte-6kads1");
    			add_location(h4, file$a, 9, 2, 178);
    			attr_dev(p0, "id", "content");
    			attr_dev(p0, "class", "svelte-6kads1");
    			add_location(p0, file$a, 10, 2, 213);
    			attr_dev(p1, "id", "timestamp");
    			attr_dev(p1, "class", "svelte-6kads1");
    			add_location(p1, file$a, 11, 2, 246);
    			attr_dev(div, "class", "post-container svelte-6kads1");
    			add_location(div, file$a, 7, 0, 115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, h4);
    			append_dev(h4, t2);
    			append_dev(div, t3);
    			append_dev(div, p0);
    			append_dev(p0, t4);
    			append_dev(div, t5);
    			append_dev(div, p1);
    			append_dev(p1, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*creator*/ 4) set_data_dev(t2, /*creator*/ ctx[2]);
    			if (dirty & /*content*/ 2) set_data_dev(t4, /*content*/ ctx[1]);
    			if (dirty & /*timestamp*/ 8) set_data_dev(t6, /*timestamp*/ ctx[3]);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Post', slots, []);
    	let { title } = $$props;
    	let { content } = $$props;
    	let { creator } = $$props;
    	let { timestamp } = $$props;
    	const writable_props = ['title', 'content', 'creator', 'timestamp'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Post> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('content' in $$props) $$invalidate(1, content = $$props.content);
    		if ('creator' in $$props) $$invalidate(2, creator = $$props.creator);
    		if ('timestamp' in $$props) $$invalidate(3, timestamp = $$props.timestamp);
    	};

    	$$self.$capture_state = () => ({ title, content, creator, timestamp });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('content' in $$props) $$invalidate(1, content = $$props.content);
    		if ('creator' in $$props) $$invalidate(2, creator = $$props.creator);
    		if ('timestamp' in $$props) $$invalidate(3, timestamp = $$props.timestamp);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, content, creator, timestamp];
    }

    class Post extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			title: 0,
    			content: 1,
    			creator: 2,
    			timestamp: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Post",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<Post> was created without expected prop 'title'");
    		}

    		if (/*content*/ ctx[1] === undefined && !('content' in props)) {
    			console.warn("<Post> was created without expected prop 'content'");
    		}

    		if (/*creator*/ ctx[2] === undefined && !('creator' in props)) {
    			console.warn("<Post> was created without expected prop 'creator'");
    		}

    		if (/*timestamp*/ ctx[3] === undefined && !('timestamp' in props)) {
    			console.warn("<Post> was created without expected prop 'timestamp'");
    		}
    	}

    	get title() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get content() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get creator() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set creator(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timestamp() {
    		throw new Error("<Post>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timestamp(value) {
    		throw new Error("<Post>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\StudentCard.svelte generated by Svelte v3.47.0 */

    const file$9 = "src\\components\\StudentCard.svelte";

    // (56:0) {:else}
    function create_else_block(ctx) {
    	let div2;
    	let div0;
    	let h3;
    	let t0_value = /*firstName*/ ctx[6] + " " + /*lastName*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let h50;
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let hr;
    	let t8;
    	let div1;
    	let h51;
    	let t10;
    	let p1;
    	let t11;
    	let t12;
    	let p2;
    	let t13;
    	let t14;
    	let p3;
    	let t15;
    	let mounted;
    	let dispose;
    	let if_block = /*showGrades*/ ctx[13] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			h50 = element("h5");
    			t2 = text(/*studentNumber*/ ctx[8]);
    			t3 = space();
    			p0 = element("p");
    			t4 = text("Klasse: ");
    			t5 = text(/*className*/ ctx[9]);
    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			hr = element("hr");
    			t8 = space();
    			div1 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Kontakt";
    			t10 = space();
    			p1 = element("p");
    			t11 = text(/*email*/ ctx[10]);
    			t12 = space();
    			p2 = element("p");
    			t13 = text(/*phone*/ ctx[11]);
    			t14 = space();
    			p3 = element("p");
    			t15 = text(/*address*/ ctx[12]);
    			attr_dev(h3, "id", "name");
    			attr_dev(h3, "class", "svelte-1aw0yuq");
    			add_location(h3, file$9, 63, 6, 1228);
    			attr_dev(h50, "id", "student-number");
    			attr_dev(h50, "class", "svelte-1aw0yuq");
    			add_location(h50, file$9, 64, 6, 1283);
    			attr_dev(p0, "id", "class");
    			attr_dev(p0, "class", "svelte-1aw0yuq");
    			add_location(p0, file$9, 65, 6, 1335);
    			attr_dev(div0, "class", "general-info svelte-1aw0yuq");
    			add_location(div0, file$9, 62, 4, 1194);
    			attr_dev(hr, "class", "svelte-1aw0yuq");
    			add_location(hr, file$9, 80, 4, 1711);
    			attr_dev(h51, "id", "contact-heading");
    			attr_dev(h51, "class", "svelte-1aw0yuq");
    			add_location(h51, file$9, 83, 6, 1759);
    			attr_dev(p1, "class", "svelte-1aw0yuq");
    			add_location(p1, file$9, 84, 6, 1804);
    			attr_dev(p2, "class", "svelte-1aw0yuq");
    			add_location(p2, file$9, 85, 6, 1826);
    			attr_dev(p3, "class", "svelte-1aw0yuq");
    			add_location(p3, file$9, 86, 6, 1848);
    			attr_dev(div1, "class", "contact-info svelte-1aw0yuq");
    			add_location(div1, file$9, 82, 4, 1725);
    			attr_dev(div2, "id", "card-lg");
    			attr_dev(div2, "class", "card-container svelte-1aw0yuq");
    			toggle_class(div2, "inspect", /*overview*/ ctx[14] === true);
    			add_location(div2, file$9, 56, 2, 1053);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t0);
    			append_dev(div0, t1);
    			append_dev(div0, h50);
    			append_dev(h50, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(div2, t6);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t7);
    			append_dev(div2, hr);
    			append_dev(div2, t8);
    			append_dev(div2, div1);
    			append_dev(div1, h51);
    			append_dev(div1, t10);
    			append_dev(div1, p1);
    			append_dev(p1, t11);
    			append_dev(div1, t12);
    			append_dev(div1, p2);
    			append_dev(p2, t13);
    			append_dev(div1, t14);
    			append_dev(div1, p3);
    			append_dev(p3, t15);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*handleStopInspectStudent*/ ctx[16], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firstName, lastName*/ 192 && t0_value !== (t0_value = /*firstName*/ ctx[6] + " " + /*lastName*/ ctx[7] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*studentNumber*/ 256) set_data_dev(t2, /*studentNumber*/ ctx[8]);
    			if (dirty & /*className*/ 512) set_data_dev(t5, /*className*/ ctx[9]);

    			if (/*showGrades*/ ctx[13]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div2, t7);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*email*/ 1024) set_data_dev(t11, /*email*/ ctx[10]);
    			if (dirty & /*phone*/ 2048) set_data_dev(t13, /*phone*/ ctx[11]);
    			if (dirty & /*address*/ 4096) set_data_dev(t15, /*address*/ ctx[12]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(56:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:0) {#if small}
    function create_if_block$4(ctx) {
    	let div;
    	let p0;
    	let t0_value = /*firstName*/ ctx[6] + " " + /*lastName*/ ctx[7] + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(/*className*/ ctx[9]);
    			attr_dev(p0, "class", "name svelte-1aw0yuq");
    			add_location(p0, file$9, 52, 4, 944);
    			attr_dev(p1, "class", "class svelte-1aw0yuq");
    			add_location(p1, file$9, 53, 4, 998);
    			attr_dev(div, "class", "card-container-small svelte-1aw0yuq");
    			add_location(div, file$9, 51, 2, 872);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*handleInspectStudent*/ ctx[15], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*firstName, lastName*/ 192 && t0_value !== (t0_value = /*firstName*/ ctx[6] + " " + /*lastName*/ ctx[7] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*className*/ 512) set_data_dev(t2, /*className*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(51:0) {#if small}",
    		ctx
    	});

    	return block;
    }

    // (69:4) {#if showGrades}
    function create_if_block_1(ctx) {
    	let hr;
    	let t0;
    	let div;
    	let h5;
    	let t2;
    	let p0;
    	let t3;
    	let t4;
    	let t5;
    	let p1;
    	let t6;
    	let t7;
    	let t8;
    	let p2;
    	let t9;
    	let t10;
    	let t11;
    	let p3;
    	let t12;
    	let t13;
    	let t14;
    	let p4;
    	let t15;
    	let t16;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			t0 = space();
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "Karakterer";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("Dansk: ");
    			t4 = text(/*dansk*/ ctx[0]);
    			t5 = space();
    			p1 = element("p");
    			t6 = text("Engelsk: ");
    			t7 = text(/*engelsk*/ ctx[1]);
    			t8 = space();
    			p2 = element("p");
    			t9 = text("Historie: ");
    			t10 = text(/*historie*/ ctx[2]);
    			t11 = space();
    			p3 = element("p");
    			t12 = text("Matematik: ");
    			t13 = text(/*matematik*/ ctx[3]);
    			t14 = space();
    			p4 = element("p");
    			t15 = text("Geografi: ");
    			t16 = text(/*geografi*/ ctx[4]);
    			attr_dev(hr, "class", "svelte-1aw0yuq");
    			add_location(hr, file$9, 69, 6, 1416);
    			attr_dev(h5, "id", "grades-heading");
    			attr_dev(h5, "class", "svelte-1aw0yuq");
    			add_location(h5, file$9, 71, 8, 1460);
    			attr_dev(p0, "class", "svelte-1aw0yuq");
    			add_location(p0, file$9, 72, 8, 1509);
    			attr_dev(p1, "class", "svelte-1aw0yuq");
    			add_location(p1, file$9, 73, 8, 1540);
    			attr_dev(p2, "class", "svelte-1aw0yuq");
    			add_location(p2, file$9, 74, 8, 1575);
    			attr_dev(p3, "class", "svelte-1aw0yuq");
    			add_location(p3, file$9, 75, 8, 1612);
    			attr_dev(p4, "class", "svelte-1aw0yuq");
    			add_location(p4, file$9, 76, 8, 1651);
    			attr_dev(div, "class", "grades svelte-1aw0yuq");
    			add_location(div, file$9, 70, 6, 1430);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(div, t2);
    			append_dev(div, p0);
    			append_dev(p0, t3);
    			append_dev(p0, t4);
    			append_dev(div, t5);
    			append_dev(div, p1);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    			append_dev(div, t8);
    			append_dev(div, p2);
    			append_dev(p2, t9);
    			append_dev(p2, t10);
    			append_dev(div, t11);
    			append_dev(div, p3);
    			append_dev(p3, t12);
    			append_dev(p3, t13);
    			append_dev(div, t14);
    			append_dev(div, p4);
    			append_dev(p4, t15);
    			append_dev(p4, t16);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dansk*/ 1) set_data_dev(t4, /*dansk*/ ctx[0]);
    			if (dirty & /*engelsk*/ 2) set_data_dev(t7, /*engelsk*/ ctx[1]);
    			if (dirty & /*historie*/ 4) set_data_dev(t10, /*historie*/ ctx[2]);
    			if (dirty & /*matematik*/ 8) set_data_dev(t13, /*matematik*/ ctx[3]);
    			if (dirty & /*geografi*/ 16) set_data_dev(t16, /*geografi*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(69:4) {#if showGrades}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*small*/ ctx[5]) return create_if_block$4;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StudentCard', slots, []);
    	let { firstName } = $$props;
    	let { lastName } = $$props;
    	let { studentNumber } = $$props;
    	let { className } = $$props;
    	let { email } = $$props;
    	let { phone } = $$props;
    	let { address } = $$props;
    	let { showGrades } = $$props;
    	let { dansk } = $$props;
    	let { engelsk } = $$props;
    	let { historie } = $$props;
    	let { matematik } = $$props;
    	let { geografi } = $$props;
    	let { small } = $$props;
    	let overview = small;

    	//remove null values
    	if (dansk == null) {
    		dansk = "";
    	}

    	if (engelsk == null) {
    		engelsk = "";
    	}

    	if (historie == null) {
    		historie = "";
    	}

    	if (matematik == null) {
    		matematik = "";
    	}

    	if (geografi == null) {
    		geografi = "";
    	}

    	function handleInspectStudent() {
    		if (overview) {
    			$$invalidate(5, small = false);
    		}
    	}

    	function handleStopInspectStudent() {
    		if (overview) {
    			$$invalidate(5, small = true);
    		}
    	}

    	const writable_props = [
    		'firstName',
    		'lastName',
    		'studentNumber',
    		'className',
    		'email',
    		'phone',
    		'address',
    		'showGrades',
    		'dansk',
    		'engelsk',
    		'historie',
    		'matematik',
    		'geografi',
    		'small'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StudentCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('firstName' in $$props) $$invalidate(6, firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate(7, lastName = $$props.lastName);
    		if ('studentNumber' in $$props) $$invalidate(8, studentNumber = $$props.studentNumber);
    		if ('className' in $$props) $$invalidate(9, className = $$props.className);
    		if ('email' in $$props) $$invalidate(10, email = $$props.email);
    		if ('phone' in $$props) $$invalidate(11, phone = $$props.phone);
    		if ('address' in $$props) $$invalidate(12, address = $$props.address);
    		if ('showGrades' in $$props) $$invalidate(13, showGrades = $$props.showGrades);
    		if ('dansk' in $$props) $$invalidate(0, dansk = $$props.dansk);
    		if ('engelsk' in $$props) $$invalidate(1, engelsk = $$props.engelsk);
    		if ('historie' in $$props) $$invalidate(2, historie = $$props.historie);
    		if ('matematik' in $$props) $$invalidate(3, matematik = $$props.matematik);
    		if ('geografi' in $$props) $$invalidate(4, geografi = $$props.geografi);
    		if ('small' in $$props) $$invalidate(5, small = $$props.small);
    	};

    	$$self.$capture_state = () => ({
    		firstName,
    		lastName,
    		studentNumber,
    		className,
    		email,
    		phone,
    		address,
    		showGrades,
    		dansk,
    		engelsk,
    		historie,
    		matematik,
    		geografi,
    		small,
    		overview,
    		handleInspectStudent,
    		handleStopInspectStudent
    	});

    	$$self.$inject_state = $$props => {
    		if ('firstName' in $$props) $$invalidate(6, firstName = $$props.firstName);
    		if ('lastName' in $$props) $$invalidate(7, lastName = $$props.lastName);
    		if ('studentNumber' in $$props) $$invalidate(8, studentNumber = $$props.studentNumber);
    		if ('className' in $$props) $$invalidate(9, className = $$props.className);
    		if ('email' in $$props) $$invalidate(10, email = $$props.email);
    		if ('phone' in $$props) $$invalidate(11, phone = $$props.phone);
    		if ('address' in $$props) $$invalidate(12, address = $$props.address);
    		if ('showGrades' in $$props) $$invalidate(13, showGrades = $$props.showGrades);
    		if ('dansk' in $$props) $$invalidate(0, dansk = $$props.dansk);
    		if ('engelsk' in $$props) $$invalidate(1, engelsk = $$props.engelsk);
    		if ('historie' in $$props) $$invalidate(2, historie = $$props.historie);
    		if ('matematik' in $$props) $$invalidate(3, matematik = $$props.matematik);
    		if ('geografi' in $$props) $$invalidate(4, geografi = $$props.geografi);
    		if ('small' in $$props) $$invalidate(5, small = $$props.small);
    		if ('overview' in $$props) $$invalidate(14, overview = $$props.overview);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dansk,
    		engelsk,
    		historie,
    		matematik,
    		geografi,
    		small,
    		firstName,
    		lastName,
    		studentNumber,
    		className,
    		email,
    		phone,
    		address,
    		showGrades,
    		overview,
    		handleInspectStudent,
    		handleStopInspectStudent
    	];
    }

    class StudentCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			firstName: 6,
    			lastName: 7,
    			studentNumber: 8,
    			className: 9,
    			email: 10,
    			phone: 11,
    			address: 12,
    			showGrades: 13,
    			dansk: 0,
    			engelsk: 1,
    			historie: 2,
    			matematik: 3,
    			geografi: 4,
    			small: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StudentCard",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*firstName*/ ctx[6] === undefined && !('firstName' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'firstName'");
    		}

    		if (/*lastName*/ ctx[7] === undefined && !('lastName' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'lastName'");
    		}

    		if (/*studentNumber*/ ctx[8] === undefined && !('studentNumber' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'studentNumber'");
    		}

    		if (/*className*/ ctx[9] === undefined && !('className' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'className'");
    		}

    		if (/*email*/ ctx[10] === undefined && !('email' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'email'");
    		}

    		if (/*phone*/ ctx[11] === undefined && !('phone' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'phone'");
    		}

    		if (/*address*/ ctx[12] === undefined && !('address' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'address'");
    		}

    		if (/*showGrades*/ ctx[13] === undefined && !('showGrades' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'showGrades'");
    		}

    		if (/*dansk*/ ctx[0] === undefined && !('dansk' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'dansk'");
    		}

    		if (/*engelsk*/ ctx[1] === undefined && !('engelsk' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'engelsk'");
    		}

    		if (/*historie*/ ctx[2] === undefined && !('historie' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'historie'");
    		}

    		if (/*matematik*/ ctx[3] === undefined && !('matematik' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'matematik'");
    		}

    		if (/*geografi*/ ctx[4] === undefined && !('geografi' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'geografi'");
    		}

    		if (/*small*/ ctx[5] === undefined && !('small' in props)) {
    			console.warn("<StudentCard> was created without expected prop 'small'");
    		}
    	}

    	get firstName() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstName(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lastName() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lastName(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get studentNumber() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set studentNumber(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get email() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set email(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get phone() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set phone(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get address() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set address(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showGrades() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showGrades(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dansk() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dansk(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get engelsk() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set engelsk(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get historie() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set historie(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get matematik() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matematik(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geografi() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geografi(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get small() {
    		throw new Error("<StudentCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set small(value) {
    		throw new Error("<StudentCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var moment = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        module.exports = factory() ;
    }(commonjsGlobal, (function () {
        var hookCallback;

        function hooks() {
            return hookCallback.apply(null, arguments);
        }

        // This is done to register the method called with moment()
        // without creating circular dependencies.
        function setHookCallback(callback) {
            hookCallback = callback;
        }

        function isArray(input) {
            return (
                input instanceof Array ||
                Object.prototype.toString.call(input) === '[object Array]'
            );
        }

        function isObject(input) {
            // IE8 will treat undefined and null as object if it wasn't for
            // input != null
            return (
                input != null &&
                Object.prototype.toString.call(input) === '[object Object]'
            );
        }

        function hasOwnProp(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b);
        }

        function isObjectEmpty(obj) {
            if (Object.getOwnPropertyNames) {
                return Object.getOwnPropertyNames(obj).length === 0;
            } else {
                var k;
                for (k in obj) {
                    if (hasOwnProp(obj, k)) {
                        return false;
                    }
                }
                return true;
            }
        }

        function isUndefined(input) {
            return input === void 0;
        }

        function isNumber(input) {
            return (
                typeof input === 'number' ||
                Object.prototype.toString.call(input) === '[object Number]'
            );
        }

        function isDate(input) {
            return (
                input instanceof Date ||
                Object.prototype.toString.call(input) === '[object Date]'
            );
        }

        function map(arr, fn) {
            var res = [],
                i,
                arrLen = arr.length;
            for (i = 0; i < arrLen; ++i) {
                res.push(fn(arr[i], i));
            }
            return res;
        }

        function extend(a, b) {
            for (var i in b) {
                if (hasOwnProp(b, i)) {
                    a[i] = b[i];
                }
            }

            if (hasOwnProp(b, 'toString')) {
                a.toString = b.toString;
            }

            if (hasOwnProp(b, 'valueOf')) {
                a.valueOf = b.valueOf;
            }

            return a;
        }

        function createUTC(input, format, locale, strict) {
            return createLocalOrUTC(input, format, locale, strict, true).utc();
        }

        function defaultParsingFlags() {
            // We need to deep clone this object.
            return {
                empty: false,
                unusedTokens: [],
                unusedInput: [],
                overflow: -2,
                charsLeftOver: 0,
                nullInput: false,
                invalidEra: null,
                invalidMonth: null,
                invalidFormat: false,
                userInvalidated: false,
                iso: false,
                parsedDateParts: [],
                era: null,
                meridiem: null,
                rfc2822: false,
                weekdayMismatch: false,
            };
        }

        function getParsingFlags(m) {
            if (m._pf == null) {
                m._pf = defaultParsingFlags();
            }
            return m._pf;
        }

        var some;
        if (Array.prototype.some) {
            some = Array.prototype.some;
        } else {
            some = function (fun) {
                var t = Object(this),
                    len = t.length >>> 0,
                    i;

                for (i = 0; i < len; i++) {
                    if (i in t && fun.call(this, t[i], i, t)) {
                        return true;
                    }
                }

                return false;
            };
        }

        function isValid(m) {
            if (m._isValid == null) {
                var flags = getParsingFlags(m),
                    parsedParts = some.call(flags.parsedDateParts, function (i) {
                        return i != null;
                    }),
                    isNowValid =
                        !isNaN(m._d.getTime()) &&
                        flags.overflow < 0 &&
                        !flags.empty &&
                        !flags.invalidEra &&
                        !flags.invalidMonth &&
                        !flags.invalidWeekday &&
                        !flags.weekdayMismatch &&
                        !flags.nullInput &&
                        !flags.invalidFormat &&
                        !flags.userInvalidated &&
                        (!flags.meridiem || (flags.meridiem && parsedParts));

                if (m._strict) {
                    isNowValid =
                        isNowValid &&
                        flags.charsLeftOver === 0 &&
                        flags.unusedTokens.length === 0 &&
                        flags.bigHour === undefined;
                }

                if (Object.isFrozen == null || !Object.isFrozen(m)) {
                    m._isValid = isNowValid;
                } else {
                    return isNowValid;
                }
            }
            return m._isValid;
        }

        function createInvalid(flags) {
            var m = createUTC(NaN);
            if (flags != null) {
                extend(getParsingFlags(m), flags);
            } else {
                getParsingFlags(m).userInvalidated = true;
            }

            return m;
        }

        // Plugins that add properties should also add the key here (null value),
        // so we can properly clone ourselves.
        var momentProperties = (hooks.momentProperties = []),
            updateInProgress = false;

        function copyConfig(to, from) {
            var i,
                prop,
                val,
                momentPropertiesLen = momentProperties.length;

            if (!isUndefined(from._isAMomentObject)) {
                to._isAMomentObject = from._isAMomentObject;
            }
            if (!isUndefined(from._i)) {
                to._i = from._i;
            }
            if (!isUndefined(from._f)) {
                to._f = from._f;
            }
            if (!isUndefined(from._l)) {
                to._l = from._l;
            }
            if (!isUndefined(from._strict)) {
                to._strict = from._strict;
            }
            if (!isUndefined(from._tzm)) {
                to._tzm = from._tzm;
            }
            if (!isUndefined(from._isUTC)) {
                to._isUTC = from._isUTC;
            }
            if (!isUndefined(from._offset)) {
                to._offset = from._offset;
            }
            if (!isUndefined(from._pf)) {
                to._pf = getParsingFlags(from);
            }
            if (!isUndefined(from._locale)) {
                to._locale = from._locale;
            }

            if (momentPropertiesLen > 0) {
                for (i = 0; i < momentPropertiesLen; i++) {
                    prop = momentProperties[i];
                    val = from[prop];
                    if (!isUndefined(val)) {
                        to[prop] = val;
                    }
                }
            }

            return to;
        }

        // Moment prototype object
        function Moment(config) {
            copyConfig(this, config);
            this._d = new Date(config._d != null ? config._d.getTime() : NaN);
            if (!this.isValid()) {
                this._d = new Date(NaN);
            }
            // Prevent infinite loop in case updateOffset creates new moment
            // objects.
            if (updateInProgress === false) {
                updateInProgress = true;
                hooks.updateOffset(this);
                updateInProgress = false;
            }
        }

        function isMoment(obj) {
            return (
                obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
            );
        }

        function warn(msg) {
            if (
                hooks.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' &&
                console.warn
            ) {
                console.warn('Deprecation warning: ' + msg);
            }
        }

        function deprecate(msg, fn) {
            var firstTime = true;

            return extend(function () {
                if (hooks.deprecationHandler != null) {
                    hooks.deprecationHandler(null, msg);
                }
                if (firstTime) {
                    var args = [],
                        arg,
                        i,
                        key,
                        argLen = arguments.length;
                    for (i = 0; i < argLen; i++) {
                        arg = '';
                        if (typeof arguments[i] === 'object') {
                            arg += '\n[' + i + '] ';
                            for (key in arguments[0]) {
                                if (hasOwnProp(arguments[0], key)) {
                                    arg += key + ': ' + arguments[0][key] + ', ';
                                }
                            }
                            arg = arg.slice(0, -2); // Remove trailing comma and space
                        } else {
                            arg = arguments[i];
                        }
                        args.push(arg);
                    }
                    warn(
                        msg +
                            '\nArguments: ' +
                            Array.prototype.slice.call(args).join('') +
                            '\n' +
                            new Error().stack
                    );
                    firstTime = false;
                }
                return fn.apply(this, arguments);
            }, fn);
        }

        var deprecations = {};

        function deprecateSimple(name, msg) {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(name, msg);
            }
            if (!deprecations[name]) {
                warn(msg);
                deprecations[name] = true;
            }
        }

        hooks.suppressDeprecationWarnings = false;
        hooks.deprecationHandler = null;

        function isFunction(input) {
            return (
                (typeof Function !== 'undefined' && input instanceof Function) ||
                Object.prototype.toString.call(input) === '[object Function]'
            );
        }

        function set(config) {
            var prop, i;
            for (i in config) {
                if (hasOwnProp(config, i)) {
                    prop = config[i];
                    if (isFunction(prop)) {
                        this[i] = prop;
                    } else {
                        this['_' + i] = prop;
                    }
                }
            }
            this._config = config;
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
            // TODO: Remove "ordinalParse" fallback in next major release.
            this._dayOfMonthOrdinalParseLenient = new RegExp(
                (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                    '|' +
                    /\d{1,2}/.source
            );
        }

        function mergeConfigs(parentConfig, childConfig) {
            var res = extend({}, parentConfig),
                prop;
            for (prop in childConfig) {
                if (hasOwnProp(childConfig, prop)) {
                    if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                        res[prop] = {};
                        extend(res[prop], parentConfig[prop]);
                        extend(res[prop], childConfig[prop]);
                    } else if (childConfig[prop] != null) {
                        res[prop] = childConfig[prop];
                    } else {
                        delete res[prop];
                    }
                }
            }
            for (prop in parentConfig) {
                if (
                    hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])
                ) {
                    // make sure changes to properties don't modify parent config
                    res[prop] = extend({}, res[prop]);
                }
            }
            return res;
        }

        function Locale(config) {
            if (config != null) {
                this.set(config);
            }
        }

        var keys;

        if (Object.keys) {
            keys = Object.keys;
        } else {
            keys = function (obj) {
                var i,
                    res = [];
                for (i in obj) {
                    if (hasOwnProp(obj, i)) {
                        res.push(i);
                    }
                }
                return res;
            };
        }

        var defaultCalendar = {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
        };

        function calendar(key, mom, now) {
            var output = this._calendar[key] || this._calendar['sameElse'];
            return isFunction(output) ? output.call(mom, now) : output;
        }

        function zeroFill(number, targetLength, forceSign) {
            var absNumber = '' + Math.abs(number),
                zerosToFill = targetLength - absNumber.length,
                sign = number >= 0;
            return (
                (sign ? (forceSign ? '+' : '') : '-') +
                Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
                absNumber
            );
        }

        var formattingTokens =
                /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
            formatFunctions = {},
            formatTokenFunctions = {};

        // token:    'M'
        // padded:   ['MM', 2]
        // ordinal:  'Mo'
        // callback: function () { this.month() + 1 }
        function addFormatToken(token, padded, ordinal, callback) {
            var func = callback;
            if (typeof callback === 'string') {
                func = function () {
                    return this[callback]();
                };
            }
            if (token) {
                formatTokenFunctions[token] = func;
            }
            if (padded) {
                formatTokenFunctions[padded[0]] = function () {
                    return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
                };
            }
            if (ordinal) {
                formatTokenFunctions[ordinal] = function () {
                    return this.localeData().ordinal(
                        func.apply(this, arguments),
                        token
                    );
                };
            }
        }

        function removeFormattingTokens(input) {
            if (input.match(/\[[\s\S]/)) {
                return input.replace(/^\[|\]$/g, '');
            }
            return input.replace(/\\/g, '');
        }

        function makeFormatFunction(format) {
            var array = format.match(formattingTokens),
                i,
                length;

            for (i = 0, length = array.length; i < length; i++) {
                if (formatTokenFunctions[array[i]]) {
                    array[i] = formatTokenFunctions[array[i]];
                } else {
                    array[i] = removeFormattingTokens(array[i]);
                }
            }

            return function (mom) {
                var output = '',
                    i;
                for (i = 0; i < length; i++) {
                    output += isFunction(array[i])
                        ? array[i].call(mom, format)
                        : array[i];
                }
                return output;
            };
        }

        // format date using native date object
        function formatMoment(m, format) {
            if (!m.isValid()) {
                return m.localeData().invalidDate();
            }

            format = expandFormat(format, m.localeData());
            formatFunctions[format] =
                formatFunctions[format] || makeFormatFunction(format);

            return formatFunctions[format](m);
        }

        function expandFormat(format, locale) {
            var i = 5;

            function replaceLongDateFormatTokens(input) {
                return locale.longDateFormat(input) || input;
            }

            localFormattingTokens.lastIndex = 0;
            while (i >= 0 && localFormattingTokens.test(format)) {
                format = format.replace(
                    localFormattingTokens,
                    replaceLongDateFormatTokens
                );
                localFormattingTokens.lastIndex = 0;
                i -= 1;
            }

            return format;
        }

        var defaultLongDateFormat = {
            LTS: 'h:mm:ss A',
            LT: 'h:mm A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY h:mm A',
            LLLL: 'dddd, MMMM D, YYYY h:mm A',
        };

        function longDateFormat(key) {
            var format = this._longDateFormat[key],
                formatUpper = this._longDateFormat[key.toUpperCase()];

            if (format || !formatUpper) {
                return format;
            }

            this._longDateFormat[key] = formatUpper
                .match(formattingTokens)
                .map(function (tok) {
                    if (
                        tok === 'MMMM' ||
                        tok === 'MM' ||
                        tok === 'DD' ||
                        tok === 'dddd'
                    ) {
                        return tok.slice(1);
                    }
                    return tok;
                })
                .join('');

            return this._longDateFormat[key];
        }

        var defaultInvalidDate = 'Invalid date';

        function invalidDate() {
            return this._invalidDate;
        }

        var defaultOrdinal = '%d',
            defaultDayOfMonthOrdinalParse = /\d{1,2}/;

        function ordinal(number) {
            return this._ordinal.replace('%d', number);
        }

        var defaultRelativeTime = {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            w: 'a week',
            ww: '%d weeks',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
        };

        function relativeTime(number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return isFunction(output)
                ? output(number, withoutSuffix, string, isFuture)
                : output.replace(/%d/i, number);
        }

        function pastFuture(diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return isFunction(format) ? format(output) : format.replace(/%s/i, output);
        }

        var aliases = {};

        function addUnitAlias(unit, shorthand) {
            var lowerCase = unit.toLowerCase();
            aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
        }

        function normalizeUnits(units) {
            return typeof units === 'string'
                ? aliases[units] || aliases[units.toLowerCase()]
                : undefined;
        }

        function normalizeObjectUnits(inputObject) {
            var normalizedInput = {},
                normalizedProp,
                prop;

            for (prop in inputObject) {
                if (hasOwnProp(inputObject, prop)) {
                    normalizedProp = normalizeUnits(prop);
                    if (normalizedProp) {
                        normalizedInput[normalizedProp] = inputObject[prop];
                    }
                }
            }

            return normalizedInput;
        }

        var priorities = {};

        function addUnitPriority(unit, priority) {
            priorities[unit] = priority;
        }

        function getPrioritizedUnits(unitsObj) {
            var units = [],
                u;
            for (u in unitsObj) {
                if (hasOwnProp(unitsObj, u)) {
                    units.push({ unit: u, priority: priorities[u] });
                }
            }
            units.sort(function (a, b) {
                return a.priority - b.priority;
            });
            return units;
        }

        function isLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }

        function absFloor(number) {
            if (number < 0) {
                // -0 -> 0
                return Math.ceil(number) || 0;
            } else {
                return Math.floor(number);
            }
        }

        function toInt(argumentForCoercion) {
            var coercedNumber = +argumentForCoercion,
                value = 0;

            if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                value = absFloor(coercedNumber);
            }

            return value;
        }

        function makeGetSet(unit, keepTime) {
            return function (value) {
                if (value != null) {
                    set$1(this, unit, value);
                    hooks.updateOffset(this, keepTime);
                    return this;
                } else {
                    return get(this, unit);
                }
            };
        }

        function get(mom, unit) {
            return mom.isValid()
                ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
                : NaN;
        }

        function set$1(mom, unit, value) {
            if (mom.isValid() && !isNaN(value)) {
                if (
                    unit === 'FullYear' &&
                    isLeapYear(mom.year()) &&
                    mom.month() === 1 &&
                    mom.date() === 29
                ) {
                    value = toInt(value);
                    mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                        value,
                        mom.month(),
                        daysInMonth(value, mom.month())
                    );
                } else {
                    mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
                }
            }
        }

        // MOMENTS

        function stringGet(units) {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units]();
            }
            return this;
        }

        function stringSet(units, value) {
            if (typeof units === 'object') {
                units = normalizeObjectUnits(units);
                var prioritized = getPrioritizedUnits(units),
                    i,
                    prioritizedLen = prioritized.length;
                for (i = 0; i < prioritizedLen; i++) {
                    this[prioritized[i].unit](units[prioritized[i].unit]);
                }
            } else {
                units = normalizeUnits(units);
                if (isFunction(this[units])) {
                    return this[units](value);
                }
            }
            return this;
        }

        var match1 = /\d/, //       0 - 9
            match2 = /\d\d/, //      00 - 99
            match3 = /\d{3}/, //     000 - 999
            match4 = /\d{4}/, //    0000 - 9999
            match6 = /[+-]?\d{6}/, // -999999 - 999999
            match1to2 = /\d\d?/, //       0 - 99
            match3to4 = /\d\d\d\d?/, //     999 - 9999
            match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
            match1to3 = /\d{1,3}/, //       0 - 999
            match1to4 = /\d{1,4}/, //       0 - 9999
            match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
            matchUnsigned = /\d+/, //       0 - inf
            matchSigned = /[+-]?\d+/, //    -inf - inf
            matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
            matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
            matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
            // any word (or two) characters or numbers including two/three word month in arabic.
            // includes scottish gaelic two word and hyphenated months
            matchWord =
                /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
            regexes;

        regexes = {};

        function addRegexToken(token, regex, strictRegex) {
            regexes[token] = isFunction(regex)
                ? regex
                : function (isStrict, localeData) {
                      return isStrict && strictRegex ? strictRegex : regex;
                  };
        }

        function getParseRegexForToken(token, config) {
            if (!hasOwnProp(regexes, token)) {
                return new RegExp(unescapeFormat(token));
            }

            return regexes[token](config._strict, config._locale);
        }

        // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
        function unescapeFormat(s) {
            return regexEscape(
                s
                    .replace('\\', '')
                    .replace(
                        /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
                        function (matched, p1, p2, p3, p4) {
                            return p1 || p2 || p3 || p4;
                        }
                    )
            );
        }

        function regexEscape(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        var tokens = {};

        function addParseToken(token, callback) {
            var i,
                func = callback,
                tokenLen;
            if (typeof token === 'string') {
                token = [token];
            }
            if (isNumber(callback)) {
                func = function (input, array) {
                    array[callback] = toInt(input);
                };
            }
            tokenLen = token.length;
            for (i = 0; i < tokenLen; i++) {
                tokens[token[i]] = func;
            }
        }

        function addWeekParseToken(token, callback) {
            addParseToken(token, function (input, array, config, token) {
                config._w = config._w || {};
                callback(input, config._w, config, token);
            });
        }

        function addTimeToArrayFromToken(token, input, config) {
            if (input != null && hasOwnProp(tokens, token)) {
                tokens[token](input, config._a, config, token);
            }
        }

        var YEAR = 0,
            MONTH = 1,
            DATE = 2,
            HOUR = 3,
            MINUTE = 4,
            SECOND = 5,
            MILLISECOND = 6,
            WEEK = 7,
            WEEKDAY = 8;

        function mod(n, x) {
            return ((n % x) + x) % x;
        }

        var indexOf;

        if (Array.prototype.indexOf) {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (o) {
                // I know
                var i;
                for (i = 0; i < this.length; ++i) {
                    if (this[i] === o) {
                        return i;
                    }
                }
                return -1;
            };
        }

        function daysInMonth(year, month) {
            if (isNaN(year) || isNaN(month)) {
                return NaN;
            }
            var modMonth = mod(month, 12);
            year += (month - modMonth) / 12;
            return modMonth === 1
                ? isLeapYear(year)
                    ? 29
                    : 28
                : 31 - ((modMonth % 7) % 2);
        }

        // FORMATTING

        addFormatToken('M', ['MM', 2], 'Mo', function () {
            return this.month() + 1;
        });

        addFormatToken('MMM', 0, 0, function (format) {
            return this.localeData().monthsShort(this, format);
        });

        addFormatToken('MMMM', 0, 0, function (format) {
            return this.localeData().months(this, format);
        });

        // ALIASES

        addUnitAlias('month', 'M');

        // PRIORITY

        addUnitPriority('month', 8);

        // PARSING

        addRegexToken('M', match1to2);
        addRegexToken('MM', match1to2, match2);
        addRegexToken('MMM', function (isStrict, locale) {
            return locale.monthsShortRegex(isStrict);
        });
        addRegexToken('MMMM', function (isStrict, locale) {
            return locale.monthsRegex(isStrict);
        });

        addParseToken(['M', 'MM'], function (input, array) {
            array[MONTH] = toInt(input) - 1;
        });

        addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
            var month = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (month != null) {
                array[MONTH] = month;
            } else {
                getParsingFlags(config).invalidMonth = input;
            }
        });

        // LOCALES

        var defaultLocaleMonths =
                'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                    '_'
                ),
            defaultLocaleMonthsShort =
                'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
            MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
            defaultMonthsShortRegex = matchWord,
            defaultMonthsRegex = matchWord;

        function localeMonths(m, format) {
            if (!m) {
                return isArray(this._months)
                    ? this._months
                    : this._months['standalone'];
            }
            return isArray(this._months)
                ? this._months[m.month()]
                : this._months[
                      (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                          ? 'format'
                          : 'standalone'
                  ][m.month()];
        }

        function localeMonthsShort(m, format) {
            if (!m) {
                return isArray(this._monthsShort)
                    ? this._monthsShort
                    : this._monthsShort['standalone'];
            }
            return isArray(this._monthsShort)
                ? this._monthsShort[m.month()]
                : this._monthsShort[
                      MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
                  ][m.month()];
        }

        function handleStrictParse(monthName, format, strict) {
            var i,
                ii,
                mom,
                llc = monthName.toLocaleLowerCase();
            if (!this._monthsParse) {
                // this is not used
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
                for (i = 0; i < 12; ++i) {
                    mom = createUTC([2000, i]);
                    this._shortMonthsParse[i] = this.monthsShort(
                        mom,
                        ''
                    ).toLocaleLowerCase();
                    this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
                }
            }

            if (strict) {
                if (format === 'MMM') {
                    ii = indexOf.call(this._shortMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._longMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                }
            } else {
                if (format === 'MMM') {
                    ii = indexOf.call(this._shortMonthsParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._longMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._longMonthsParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._shortMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                }
            }
        }

        function localeMonthsParse(monthName, format, strict) {
            var i, mom, regex;

            if (this._monthsParseExact) {
                return handleStrictParse.call(this, monthName, format, strict);
            }

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            // TODO: add sorting
            // Sorting makes sure if one month (or abbr) is a prefix of another
            // see sorting in computeMonthsParse
            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = createUTC([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp(
                        '^' + this.months(mom, '').replace('.', '') + '$',
                        'i'
                    );
                    this._shortMonthsParse[i] = new RegExp(
                        '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                        'i'
                    );
                }
                if (!strict && !this._monthsParse[i]) {
                    regex =
                        '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (
                    strict &&
                    format === 'MMMM' &&
                    this._longMonthsParse[i].test(monthName)
                ) {
                    return i;
                } else if (
                    strict &&
                    format === 'MMM' &&
                    this._shortMonthsParse[i].test(monthName)
                ) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        }

        // MOMENTS

        function setMonth(mom, value) {
            var dayOfMonth;

            if (!mom.isValid()) {
                // No op
                return mom;
            }

            if (typeof value === 'string') {
                if (/^\d+$/.test(value)) {
                    value = toInt(value);
                } else {
                    value = mom.localeData().monthsParse(value);
                    // TODO: Another silent failure?
                    if (!isNumber(value)) {
                        return mom;
                    }
                }
            }

            dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
            return mom;
        }

        function getSetMonth(value) {
            if (value != null) {
                setMonth(this, value);
                hooks.updateOffset(this, true);
                return this;
            } else {
                return get(this, 'Month');
            }
        }

        function getDaysInMonth() {
            return daysInMonth(this.year(), this.month());
        }

        function monthsShortRegex(isStrict) {
            if (this._monthsParseExact) {
                if (!hasOwnProp(this, '_monthsRegex')) {
                    computeMonthsParse.call(this);
                }
                if (isStrict) {
                    return this._monthsShortStrictRegex;
                } else {
                    return this._monthsShortRegex;
                }
            } else {
                if (!hasOwnProp(this, '_monthsShortRegex')) {
                    this._monthsShortRegex = defaultMonthsShortRegex;
                }
                return this._monthsShortStrictRegex && isStrict
                    ? this._monthsShortStrictRegex
                    : this._monthsShortRegex;
            }
        }

        function monthsRegex(isStrict) {
            if (this._monthsParseExact) {
                if (!hasOwnProp(this, '_monthsRegex')) {
                    computeMonthsParse.call(this);
                }
                if (isStrict) {
                    return this._monthsStrictRegex;
                } else {
                    return this._monthsRegex;
                }
            } else {
                if (!hasOwnProp(this, '_monthsRegex')) {
                    this._monthsRegex = defaultMonthsRegex;
                }
                return this._monthsStrictRegex && isStrict
                    ? this._monthsStrictRegex
                    : this._monthsRegex;
            }
        }

        function computeMonthsParse() {
            function cmpLenRev(a, b) {
                return b.length - a.length;
            }

            var shortPieces = [],
                longPieces = [],
                mixedPieces = [],
                i,
                mom;
            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = createUTC([2000, i]);
                shortPieces.push(this.monthsShort(mom, ''));
                longPieces.push(this.months(mom, ''));
                mixedPieces.push(this.months(mom, ''));
                mixedPieces.push(this.monthsShort(mom, ''));
            }
            // Sorting makes sure if one month (or abbr) is a prefix of another it
            // will match the longer piece.
            shortPieces.sort(cmpLenRev);
            longPieces.sort(cmpLenRev);
            mixedPieces.sort(cmpLenRev);
            for (i = 0; i < 12; i++) {
                shortPieces[i] = regexEscape(shortPieces[i]);
                longPieces[i] = regexEscape(longPieces[i]);
            }
            for (i = 0; i < 24; i++) {
                mixedPieces[i] = regexEscape(mixedPieces[i]);
            }

            this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
            this._monthsShortRegex = this._monthsRegex;
            this._monthsStrictRegex = new RegExp(
                '^(' + longPieces.join('|') + ')',
                'i'
            );
            this._monthsShortStrictRegex = new RegExp(
                '^(' + shortPieces.join('|') + ')',
                'i'
            );
        }

        // FORMATTING

        addFormatToken('Y', 0, 0, function () {
            var y = this.year();
            return y <= 9999 ? zeroFill(y, 4) : '+' + y;
        });

        addFormatToken(0, ['YY', 2], 0, function () {
            return this.year() % 100;
        });

        addFormatToken(0, ['YYYY', 4], 0, 'year');
        addFormatToken(0, ['YYYYY', 5], 0, 'year');
        addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

        // ALIASES

        addUnitAlias('year', 'y');

        // PRIORITIES

        addUnitPriority('year', 1);

        // PARSING

        addRegexToken('Y', matchSigned);
        addRegexToken('YY', match1to2, match2);
        addRegexToken('YYYY', match1to4, match4);
        addRegexToken('YYYYY', match1to6, match6);
        addRegexToken('YYYYYY', match1to6, match6);

        addParseToken(['YYYYY', 'YYYYYY'], YEAR);
        addParseToken('YYYY', function (input, array) {
            array[YEAR] =
                input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
        });
        addParseToken('YY', function (input, array) {
            array[YEAR] = hooks.parseTwoDigitYear(input);
        });
        addParseToken('Y', function (input, array) {
            array[YEAR] = parseInt(input, 10);
        });

        // HELPERS

        function daysInYear(year) {
            return isLeapYear(year) ? 366 : 365;
        }

        // HOOKS

        hooks.parseTwoDigitYear = function (input) {
            return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
        };

        // MOMENTS

        var getSetYear = makeGetSet('FullYear', true);

        function getIsLeapYear() {
            return isLeapYear(this.year());
        }

        function createDate(y, m, d, h, M, s, ms) {
            // can't just apply() to create a date:
            // https://stackoverflow.com/q/181348
            var date;
            // the date constructor remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                // preserve leap years using a full 400 year cycle, then reset
                date = new Date(y + 400, m, d, h, M, s, ms);
                if (isFinite(date.getFullYear())) {
                    date.setFullYear(y);
                }
            } else {
                date = new Date(y, m, d, h, M, s, ms);
            }

            return date;
        }

        function createUTCDate(y) {
            var date, args;
            // the Date.UTC function remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                args = Array.prototype.slice.call(arguments);
                // preserve leap years using a full 400 year cycle, then reset
                args[0] = y + 400;
                date = new Date(Date.UTC.apply(null, args));
                if (isFinite(date.getUTCFullYear())) {
                    date.setUTCFullYear(y);
                }
            } else {
                date = new Date(Date.UTC.apply(null, arguments));
            }

            return date;
        }

        // start-of-first-week - start-of-year
        function firstWeekOffset(year, dow, doy) {
            var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
                fwd = 7 + dow - doy,
                // first-week day local weekday -- which local weekday is fwd
                fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

            return -fwdlw + fwd - 1;
        }

        // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
        function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
            var localWeekday = (7 + weekday - dow) % 7,
                weekOffset = firstWeekOffset(year, dow, doy),
                dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
                resYear,
                resDayOfYear;

            if (dayOfYear <= 0) {
                resYear = year - 1;
                resDayOfYear = daysInYear(resYear) + dayOfYear;
            } else if (dayOfYear > daysInYear(year)) {
                resYear = year + 1;
                resDayOfYear = dayOfYear - daysInYear(year);
            } else {
                resYear = year;
                resDayOfYear = dayOfYear;
            }

            return {
                year: resYear,
                dayOfYear: resDayOfYear,
            };
        }

        function weekOfYear(mom, dow, doy) {
            var weekOffset = firstWeekOffset(mom.year(), dow, doy),
                week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
                resWeek,
                resYear;

            if (week < 1) {
                resYear = mom.year() - 1;
                resWeek = week + weeksInYear(resYear, dow, doy);
            } else if (week > weeksInYear(mom.year(), dow, doy)) {
                resWeek = week - weeksInYear(mom.year(), dow, doy);
                resYear = mom.year() + 1;
            } else {
                resYear = mom.year();
                resWeek = week;
            }

            return {
                week: resWeek,
                year: resYear,
            };
        }

        function weeksInYear(year, dow, doy) {
            var weekOffset = firstWeekOffset(year, dow, doy),
                weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
            return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
        }

        // FORMATTING

        addFormatToken('w', ['ww', 2], 'wo', 'week');
        addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

        // ALIASES

        addUnitAlias('week', 'w');
        addUnitAlias('isoWeek', 'W');

        // PRIORITIES

        addUnitPriority('week', 5);
        addUnitPriority('isoWeek', 5);

        // PARSING

        addRegexToken('w', match1to2);
        addRegexToken('ww', match1to2, match2);
        addRegexToken('W', match1to2);
        addRegexToken('WW', match1to2, match2);

        addWeekParseToken(
            ['w', 'ww', 'W', 'WW'],
            function (input, week, config, token) {
                week[token.substr(0, 1)] = toInt(input);
            }
        );

        // HELPERS

        // LOCALES

        function localeWeek(mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        }

        var defaultLocaleWeek = {
            dow: 0, // Sunday is the first day of the week.
            doy: 6, // The week that contains Jan 6th is the first week of the year.
        };

        function localeFirstDayOfWeek() {
            return this._week.dow;
        }

        function localeFirstDayOfYear() {
            return this._week.doy;
        }

        // MOMENTS

        function getSetWeek(input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        }

        function getSetISOWeek(input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        }

        // FORMATTING

        addFormatToken('d', 0, 'do', 'day');

        addFormatToken('dd', 0, 0, function (format) {
            return this.localeData().weekdaysMin(this, format);
        });

        addFormatToken('ddd', 0, 0, function (format) {
            return this.localeData().weekdaysShort(this, format);
        });

        addFormatToken('dddd', 0, 0, function (format) {
            return this.localeData().weekdays(this, format);
        });

        addFormatToken('e', 0, 0, 'weekday');
        addFormatToken('E', 0, 0, 'isoWeekday');

        // ALIASES

        addUnitAlias('day', 'd');
        addUnitAlias('weekday', 'e');
        addUnitAlias('isoWeekday', 'E');

        // PRIORITY
        addUnitPriority('day', 11);
        addUnitPriority('weekday', 11);
        addUnitPriority('isoWeekday', 11);

        // PARSING

        addRegexToken('d', match1to2);
        addRegexToken('e', match1to2);
        addRegexToken('E', match1to2);
        addRegexToken('dd', function (isStrict, locale) {
            return locale.weekdaysMinRegex(isStrict);
        });
        addRegexToken('ddd', function (isStrict, locale) {
            return locale.weekdaysShortRegex(isStrict);
        });
        addRegexToken('dddd', function (isStrict, locale) {
            return locale.weekdaysRegex(isStrict);
        });

        addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
            var weekday = config._locale.weekdaysParse(input, token, config._strict);
            // if we didn't get a weekday name, mark the date as invalid
            if (weekday != null) {
                week.d = weekday;
            } else {
                getParsingFlags(config).invalidWeekday = input;
            }
        });

        addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
            week[token] = toInt(input);
        });

        // HELPERS

        function parseWeekday(input, locale) {
            if (typeof input !== 'string') {
                return input;
            }

            if (!isNaN(input)) {
                return parseInt(input, 10);
            }

            input = locale.weekdaysParse(input);
            if (typeof input === 'number') {
                return input;
            }

            return null;
        }

        function parseIsoWeekday(input, locale) {
            if (typeof input === 'string') {
                return locale.weekdaysParse(input) % 7 || 7;
            }
            return isNaN(input) ? null : input;
        }

        // LOCALES
        function shiftWeekdays(ws, n) {
            return ws.slice(n, 7).concat(ws.slice(0, n));
        }

        var defaultLocaleWeekdays =
                'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
            defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            defaultWeekdaysRegex = matchWord,
            defaultWeekdaysShortRegex = matchWord,
            defaultWeekdaysMinRegex = matchWord;

        function localeWeekdays(m, format) {
            var weekdays = isArray(this._weekdays)
                ? this._weekdays
                : this._weekdays[
                      m && m !== true && this._weekdays.isFormat.test(format)
                          ? 'format'
                          : 'standalone'
                  ];
            return m === true
                ? shiftWeekdays(weekdays, this._week.dow)
                : m
                ? weekdays[m.day()]
                : weekdays;
        }

        function localeWeekdaysShort(m) {
            return m === true
                ? shiftWeekdays(this._weekdaysShort, this._week.dow)
                : m
                ? this._weekdaysShort[m.day()]
                : this._weekdaysShort;
        }

        function localeWeekdaysMin(m) {
            return m === true
                ? shiftWeekdays(this._weekdaysMin, this._week.dow)
                : m
                ? this._weekdaysMin[m.day()]
                : this._weekdaysMin;
        }

        function handleStrictParse$1(weekdayName, format, strict) {
            var i,
                ii,
                mom,
                llc = weekdayName.toLocaleLowerCase();
            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
                this._shortWeekdaysParse = [];
                this._minWeekdaysParse = [];

                for (i = 0; i < 7; ++i) {
                    mom = createUTC([2000, 1]).day(i);
                    this._minWeekdaysParse[i] = this.weekdaysMin(
                        mom,
                        ''
                    ).toLocaleLowerCase();
                    this._shortWeekdaysParse[i] = this.weekdaysShort(
                        mom,
                        ''
                    ).toLocaleLowerCase();
                    this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
                }
            }

            if (strict) {
                if (format === 'dddd') {
                    ii = indexOf.call(this._weekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else if (format === 'ddd') {
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                }
            } else {
                if (format === 'dddd') {
                    ii = indexOf.call(this._weekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else if (format === 'ddd') {
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._weekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._weekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                }
            }
        }

        function localeWeekdaysParse(weekdayName, format, strict) {
            var i, mom, regex;

            if (this._weekdaysParseExact) {
                return handleStrictParse$1.call(this, weekdayName, format, strict);
            }

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
                this._minWeekdaysParse = [];
                this._shortWeekdaysParse = [];
                this._fullWeekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already

                mom = createUTC([2000, 1]).day(i);
                if (strict && !this._fullWeekdaysParse[i]) {
                    this._fullWeekdaysParse[i] = new RegExp(
                        '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                        'i'
                    );
                    this._shortWeekdaysParse[i] = new RegExp(
                        '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                        'i'
                    );
                    this._minWeekdaysParse[i] = new RegExp(
                        '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                        'i'
                    );
                }
                if (!this._weekdaysParse[i]) {
                    regex =
                        '^' +
                        this.weekdays(mom, '') +
                        '|^' +
                        this.weekdaysShort(mom, '') +
                        '|^' +
                        this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (
                    strict &&
                    format === 'dddd' &&
                    this._fullWeekdaysParse[i].test(weekdayName)
                ) {
                    return i;
                } else if (
                    strict &&
                    format === 'ddd' &&
                    this._shortWeekdaysParse[i].test(weekdayName)
                ) {
                    return i;
                } else if (
                    strict &&
                    format === 'dd' &&
                    this._minWeekdaysParse[i].test(weekdayName)
                ) {
                    return i;
                } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        }

        // MOMENTS

        function getSetDayOfWeek(input) {
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        }

        function getSetLocaleDayOfWeek(input) {
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        }

        function getSetISODayOfWeek(input) {
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }

            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.

            if (input != null) {
                var weekday = parseIsoWeekday(input, this.localeData());
                return this.day(this.day() % 7 ? weekday : weekday - 7);
            } else {
                return this.day() || 7;
            }
        }

        function weekdaysRegex(isStrict) {
            if (this._weekdaysParseExact) {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    computeWeekdaysParse.call(this);
                }
                if (isStrict) {
                    return this._weekdaysStrictRegex;
                } else {
                    return this._weekdaysRegex;
                }
            } else {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    this._weekdaysRegex = defaultWeekdaysRegex;
                }
                return this._weekdaysStrictRegex && isStrict
                    ? this._weekdaysStrictRegex
                    : this._weekdaysRegex;
            }
        }

        function weekdaysShortRegex(isStrict) {
            if (this._weekdaysParseExact) {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    computeWeekdaysParse.call(this);
                }
                if (isStrict) {
                    return this._weekdaysShortStrictRegex;
                } else {
                    return this._weekdaysShortRegex;
                }
            } else {
                if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                    this._weekdaysShortRegex = defaultWeekdaysShortRegex;
                }
                return this._weekdaysShortStrictRegex && isStrict
                    ? this._weekdaysShortStrictRegex
                    : this._weekdaysShortRegex;
            }
        }

        function weekdaysMinRegex(isStrict) {
            if (this._weekdaysParseExact) {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    computeWeekdaysParse.call(this);
                }
                if (isStrict) {
                    return this._weekdaysMinStrictRegex;
                } else {
                    return this._weekdaysMinRegex;
                }
            } else {
                if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                    this._weekdaysMinRegex = defaultWeekdaysMinRegex;
                }
                return this._weekdaysMinStrictRegex && isStrict
                    ? this._weekdaysMinStrictRegex
                    : this._weekdaysMinRegex;
            }
        }

        function computeWeekdaysParse() {
            function cmpLenRev(a, b) {
                return b.length - a.length;
            }

            var minPieces = [],
                shortPieces = [],
                longPieces = [],
                mixedPieces = [],
                i,
                mom,
                minp,
                shortp,
                longp;
            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                mom = createUTC([2000, 1]).day(i);
                minp = regexEscape(this.weekdaysMin(mom, ''));
                shortp = regexEscape(this.weekdaysShort(mom, ''));
                longp = regexEscape(this.weekdays(mom, ''));
                minPieces.push(minp);
                shortPieces.push(shortp);
                longPieces.push(longp);
                mixedPieces.push(minp);
                mixedPieces.push(shortp);
                mixedPieces.push(longp);
            }
            // Sorting makes sure if one weekday (or abbr) is a prefix of another it
            // will match the longer piece.
            minPieces.sort(cmpLenRev);
            shortPieces.sort(cmpLenRev);
            longPieces.sort(cmpLenRev);
            mixedPieces.sort(cmpLenRev);

            this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
            this._weekdaysShortRegex = this._weekdaysRegex;
            this._weekdaysMinRegex = this._weekdaysRegex;

            this._weekdaysStrictRegex = new RegExp(
                '^(' + longPieces.join('|') + ')',
                'i'
            );
            this._weekdaysShortStrictRegex = new RegExp(
                '^(' + shortPieces.join('|') + ')',
                'i'
            );
            this._weekdaysMinStrictRegex = new RegExp(
                '^(' + minPieces.join('|') + ')',
                'i'
            );
        }

        // FORMATTING

        function hFormat() {
            return this.hours() % 12 || 12;
        }

        function kFormat() {
            return this.hours() || 24;
        }

        addFormatToken('H', ['HH', 2], 0, 'hour');
        addFormatToken('h', ['hh', 2], 0, hFormat);
        addFormatToken('k', ['kk', 2], 0, kFormat);

        addFormatToken('hmm', 0, 0, function () {
            return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
        });

        addFormatToken('hmmss', 0, 0, function () {
            return (
                '' +
                hFormat.apply(this) +
                zeroFill(this.minutes(), 2) +
                zeroFill(this.seconds(), 2)
            );
        });

        addFormatToken('Hmm', 0, 0, function () {
            return '' + this.hours() + zeroFill(this.minutes(), 2);
        });

        addFormatToken('Hmmss', 0, 0, function () {
            return (
                '' +
                this.hours() +
                zeroFill(this.minutes(), 2) +
                zeroFill(this.seconds(), 2)
            );
        });

        function meridiem(token, lowercase) {
            addFormatToken(token, 0, 0, function () {
                return this.localeData().meridiem(
                    this.hours(),
                    this.minutes(),
                    lowercase
                );
            });
        }

        meridiem('a', true);
        meridiem('A', false);

        // ALIASES

        addUnitAlias('hour', 'h');

        // PRIORITY
        addUnitPriority('hour', 13);

        // PARSING

        function matchMeridiem(isStrict, locale) {
            return locale._meridiemParse;
        }

        addRegexToken('a', matchMeridiem);
        addRegexToken('A', matchMeridiem);
        addRegexToken('H', match1to2);
        addRegexToken('h', match1to2);
        addRegexToken('k', match1to2);
        addRegexToken('HH', match1to2, match2);
        addRegexToken('hh', match1to2, match2);
        addRegexToken('kk', match1to2, match2);

        addRegexToken('hmm', match3to4);
        addRegexToken('hmmss', match5to6);
        addRegexToken('Hmm', match3to4);
        addRegexToken('Hmmss', match5to6);

        addParseToken(['H', 'HH'], HOUR);
        addParseToken(['k', 'kk'], function (input, array, config) {
            var kInput = toInt(input);
            array[HOUR] = kInput === 24 ? 0 : kInput;
        });
        addParseToken(['a', 'A'], function (input, array, config) {
            config._isPm = config._locale.isPM(input);
            config._meridiem = input;
        });
        addParseToken(['h', 'hh'], function (input, array, config) {
            array[HOUR] = toInt(input);
            getParsingFlags(config).bigHour = true;
        });
        addParseToken('hmm', function (input, array, config) {
            var pos = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos));
            array[MINUTE] = toInt(input.substr(pos));
            getParsingFlags(config).bigHour = true;
        });
        addParseToken('hmmss', function (input, array, config) {
            var pos1 = input.length - 4,
                pos2 = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos1));
            array[MINUTE] = toInt(input.substr(pos1, 2));
            array[SECOND] = toInt(input.substr(pos2));
            getParsingFlags(config).bigHour = true;
        });
        addParseToken('Hmm', function (input, array, config) {
            var pos = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos));
            array[MINUTE] = toInt(input.substr(pos));
        });
        addParseToken('Hmmss', function (input, array, config) {
            var pos1 = input.length - 4,
                pos2 = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos1));
            array[MINUTE] = toInt(input.substr(pos1, 2));
            array[SECOND] = toInt(input.substr(pos2));
        });

        // LOCALES

        function localeIsPM(input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return (input + '').toLowerCase().charAt(0) === 'p';
        }

        var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
            // Setting the hour should keep the time, because the user explicitly
            // specified which hour they want. So trying to maintain the same hour (in
            // a new timezone) makes sense. Adding/subtracting hours does not follow
            // this rule.
            getSetHour = makeGetSet('Hours', true);

        function localeMeridiem(hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        }

        var baseConfig = {
            calendar: defaultCalendar,
            longDateFormat: defaultLongDateFormat,
            invalidDate: defaultInvalidDate,
            ordinal: defaultOrdinal,
            dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
            relativeTime: defaultRelativeTime,

            months: defaultLocaleMonths,
            monthsShort: defaultLocaleMonthsShort,

            week: defaultLocaleWeek,

            weekdays: defaultLocaleWeekdays,
            weekdaysMin: defaultLocaleWeekdaysMin,
            weekdaysShort: defaultLocaleWeekdaysShort,

            meridiemParse: defaultLocaleMeridiemParse,
        };

        // internal storage for locale config files
        var locales = {},
            localeFamilies = {},
            globalLocale;

        function commonPrefix(arr1, arr2) {
            var i,
                minl = Math.min(arr1.length, arr2.length);
            for (i = 0; i < minl; i += 1) {
                if (arr1[i] !== arr2[i]) {
                    return i;
                }
            }
            return minl;
        }

        function normalizeLocale(key) {
            return key ? key.toLowerCase().replace('_', '-') : key;
        }

        // pick the locale from the array
        // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        function chooseLocale(names) {
            var i = 0,
                j,
                next,
                locale,
                split;

            while (i < names.length) {
                split = normalizeLocale(names[i]).split('-');
                j = split.length;
                next = normalizeLocale(names[i + 1]);
                next = next ? next.split('-') : null;
                while (j > 0) {
                    locale = loadLocale(split.slice(0, j).join('-'));
                    if (locale) {
                        return locale;
                    }
                    if (
                        next &&
                        next.length >= j &&
                        commonPrefix(split, next) >= j - 1
                    ) {
                        //the next array item is better than a shallower substring of this one
                        break;
                    }
                    j--;
                }
                i++;
            }
            return globalLocale;
        }

        function isLocaleNameSane(name) {
            // Prevent names that look like filesystem paths, i.e contain '/' or '\'
            return name.match('^[^/\\\\]*$') != null;
        }

        function loadLocale(name) {
            var oldLocale = null,
                aliasedRequire;
            // TODO: Find a better way to register and load all the locales in Node
            if (
                locales[name] === undefined &&
                'object' !== 'undefined' &&
                module &&
                module.exports &&
                isLocaleNameSane(name)
            ) {
                try {
                    oldLocale = globalLocale._abbr;
                    aliasedRequire = commonjsRequire;
                    aliasedRequire('./locale/' + name);
                    getSetGlobalLocale(oldLocale);
                } catch (e) {
                    // mark as not found to avoid repeating expensive file require call causing high CPU
                    // when trying to find en-US, en_US, en-us for every format call
                    locales[name] = null; // null means not found
                }
            }
            return locales[name];
        }

        // This function will load locale and then set the global locale.  If
        // no arguments are passed in, it will simply return the current global
        // locale key.
        function getSetGlobalLocale(key, values) {
            var data;
            if (key) {
                if (isUndefined(values)) {
                    data = getLocale(key);
                } else {
                    data = defineLocale(key, values);
                }

                if (data) {
                    // moment.duration._locale = moment._locale = data;
                    globalLocale = data;
                } else {
                    if (typeof console !== 'undefined' && console.warn) {
                        //warn user if arguments are passed but the locale could not be set
                        console.warn(
                            'Locale ' + key + ' not found. Did you forget to load it?'
                        );
                    }
                }
            }

            return globalLocale._abbr;
        }

        function defineLocale(name, config) {
            if (config !== null) {
                var locale,
                    parentConfig = baseConfig;
                config.abbr = name;
                if (locales[name] != null) {
                    deprecateSimple(
                        'defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                            'an existing locale. moment.defineLocale(localeName, ' +
                            'config) should only be used for creating a new locale ' +
                            'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                    );
                    parentConfig = locales[name]._config;
                } else if (config.parentLocale != null) {
                    if (locales[config.parentLocale] != null) {
                        parentConfig = locales[config.parentLocale]._config;
                    } else {
                        locale = loadLocale(config.parentLocale);
                        if (locale != null) {
                            parentConfig = locale._config;
                        } else {
                            if (!localeFamilies[config.parentLocale]) {
                                localeFamilies[config.parentLocale] = [];
                            }
                            localeFamilies[config.parentLocale].push({
                                name: name,
                                config: config,
                            });
                            return null;
                        }
                    }
                }
                locales[name] = new Locale(mergeConfigs(parentConfig, config));

                if (localeFamilies[name]) {
                    localeFamilies[name].forEach(function (x) {
                        defineLocale(x.name, x.config);
                    });
                }

                // backwards compat for now: also set the locale
                // make sure we set the locale AFTER all child locales have been
                // created, so we won't end up with the child locale set.
                getSetGlobalLocale(name);

                return locales[name];
            } else {
                // useful for testing
                delete locales[name];
                return null;
            }
        }

        function updateLocale(name, config) {
            if (config != null) {
                var locale,
                    tmpLocale,
                    parentConfig = baseConfig;

                if (locales[name] != null && locales[name].parentLocale != null) {
                    // Update existing child locale in-place to avoid memory-leaks
                    locales[name].set(mergeConfigs(locales[name]._config, config));
                } else {
                    // MERGE
                    tmpLocale = loadLocale(name);
                    if (tmpLocale != null) {
                        parentConfig = tmpLocale._config;
                    }
                    config = mergeConfigs(parentConfig, config);
                    if (tmpLocale == null) {
                        // updateLocale is called for creating a new locale
                        // Set abbr so it will have a name (getters return
                        // undefined otherwise).
                        config.abbr = name;
                    }
                    locale = new Locale(config);
                    locale.parentLocale = locales[name];
                    locales[name] = locale;
                }

                // backwards compat for now: also set the locale
                getSetGlobalLocale(name);
            } else {
                // pass null for config to unupdate, useful for tests
                if (locales[name] != null) {
                    if (locales[name].parentLocale != null) {
                        locales[name] = locales[name].parentLocale;
                        if (name === getSetGlobalLocale()) {
                            getSetGlobalLocale(name);
                        }
                    } else if (locales[name] != null) {
                        delete locales[name];
                    }
                }
            }
            return locales[name];
        }

        // returns locale data
        function getLocale(key) {
            var locale;

            if (key && key._locale && key._locale._abbr) {
                key = key._locale._abbr;
            }

            if (!key) {
                return globalLocale;
            }

            if (!isArray(key)) {
                //short-circuit everything else
                locale = loadLocale(key);
                if (locale) {
                    return locale;
                }
                key = [key];
            }

            return chooseLocale(key);
        }

        function listLocales() {
            return keys(locales);
        }

        function checkOverflow(m) {
            var overflow,
                a = m._a;

            if (a && getParsingFlags(m).overflow === -2) {
                overflow =
                    a[MONTH] < 0 || a[MONTH] > 11
                        ? MONTH
                        : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                        ? DATE
                        : a[HOUR] < 0 ||
                          a[HOUR] > 24 ||
                          (a[HOUR] === 24 &&
                              (a[MINUTE] !== 0 ||
                                  a[SECOND] !== 0 ||
                                  a[MILLISECOND] !== 0))
                        ? HOUR
                        : a[MINUTE] < 0 || a[MINUTE] > 59
                        ? MINUTE
                        : a[SECOND] < 0 || a[SECOND] > 59
                        ? SECOND
                        : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                        ? MILLISECOND
                        : -1;

                if (
                    getParsingFlags(m)._overflowDayOfYear &&
                    (overflow < YEAR || overflow > DATE)
                ) {
                    overflow = DATE;
                }
                if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                    overflow = WEEK;
                }
                if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                    overflow = WEEKDAY;
                }

                getParsingFlags(m).overflow = overflow;
            }

            return m;
        }

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        var extendedIsoRegex =
                /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            basicIsoRegex =
                /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
            isoDates = [
                ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
                ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
                ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
                ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
                ['YYYY-DDD', /\d{4}-\d{3}/],
                ['YYYY-MM', /\d{4}-\d\d/, false],
                ['YYYYYYMMDD', /[+-]\d{10}/],
                ['YYYYMMDD', /\d{8}/],
                ['GGGG[W]WWE', /\d{4}W\d{3}/],
                ['GGGG[W]WW', /\d{4}W\d{2}/, false],
                ['YYYYDDD', /\d{7}/],
                ['YYYYMM', /\d{6}/, false],
                ['YYYY', /\d{4}/, false],
            ],
            // iso time formats and regexes
            isoTimes = [
                ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
                ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
                ['HH:mm:ss', /\d\d:\d\d:\d\d/],
                ['HH:mm', /\d\d:\d\d/],
                ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
                ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
                ['HHmmss', /\d\d\d\d\d\d/],
                ['HHmm', /\d\d\d\d/],
                ['HH', /\d\d/],
            ],
            aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
            // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
            rfc2822 =
                /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
            obsOffsets = {
                UT: 0,
                GMT: 0,
                EDT: -4 * 60,
                EST: -5 * 60,
                CDT: -5 * 60,
                CST: -6 * 60,
                MDT: -6 * 60,
                MST: -7 * 60,
                PDT: -7 * 60,
                PST: -8 * 60,
            };

        // date from iso format
        function configFromISO(config) {
            var i,
                l,
                string = config._i,
                match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
                allowTime,
                dateFormat,
                timeFormat,
                tzFormat,
                isoDatesLen = isoDates.length,
                isoTimesLen = isoTimes.length;

            if (match) {
                getParsingFlags(config).iso = true;
                for (i = 0, l = isoDatesLen; i < l; i++) {
                    if (isoDates[i][1].exec(match[1])) {
                        dateFormat = isoDates[i][0];
                        allowTime = isoDates[i][2] !== false;
                        break;
                    }
                }
                if (dateFormat == null) {
                    config._isValid = false;
                    return;
                }
                if (match[3]) {
                    for (i = 0, l = isoTimesLen; i < l; i++) {
                        if (isoTimes[i][1].exec(match[3])) {
                            // match[2] should be 'T' or space
                            timeFormat = (match[2] || ' ') + isoTimes[i][0];
                            break;
                        }
                    }
                    if (timeFormat == null) {
                        config._isValid = false;
                        return;
                    }
                }
                if (!allowTime && timeFormat != null) {
                    config._isValid = false;
                    return;
                }
                if (match[4]) {
                    if (tzRegex.exec(match[4])) {
                        tzFormat = 'Z';
                    } else {
                        config._isValid = false;
                        return;
                    }
                }
                config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
                configFromStringAndFormat(config);
            } else {
                config._isValid = false;
            }
        }

        function extractFromRFC2822Strings(
            yearStr,
            monthStr,
            dayStr,
            hourStr,
            minuteStr,
            secondStr
        ) {
            var result = [
                untruncateYear(yearStr),
                defaultLocaleMonthsShort.indexOf(monthStr),
                parseInt(dayStr, 10),
                parseInt(hourStr, 10),
                parseInt(minuteStr, 10),
            ];

            if (secondStr) {
                result.push(parseInt(secondStr, 10));
            }

            return result;
        }

        function untruncateYear(yearStr) {
            var year = parseInt(yearStr, 10);
            if (year <= 49) {
                return 2000 + year;
            } else if (year <= 999) {
                return 1900 + year;
            }
            return year;
        }

        function preprocessRFC2822(s) {
            // Remove comments and folding whitespace and replace multiple-spaces with a single space
            return s
                .replace(/\([^)]*\)|[\n\t]/g, ' ')
                .replace(/(\s\s+)/g, ' ')
                .replace(/^\s\s*/, '')
                .replace(/\s\s*$/, '');
        }

        function checkWeekday(weekdayStr, parsedInput, config) {
            if (weekdayStr) {
                // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
                var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                    weekdayActual = new Date(
                        parsedInput[0],
                        parsedInput[1],
                        parsedInput[2]
                    ).getDay();
                if (weekdayProvided !== weekdayActual) {
                    getParsingFlags(config).weekdayMismatch = true;
                    config._isValid = false;
                    return false;
                }
            }
            return true;
        }

        function calculateOffset(obsOffset, militaryOffset, numOffset) {
            if (obsOffset) {
                return obsOffsets[obsOffset];
            } else if (militaryOffset) {
                // the only allowed military tz is Z
                return 0;
            } else {
                var hm = parseInt(numOffset, 10),
                    m = hm % 100,
                    h = (hm - m) / 100;
                return h * 60 + m;
            }
        }

        // date and time from ref 2822 format
        function configFromRFC2822(config) {
            var match = rfc2822.exec(preprocessRFC2822(config._i)),
                parsedArray;
            if (match) {
                parsedArray = extractFromRFC2822Strings(
                    match[4],
                    match[3],
                    match[2],
                    match[5],
                    match[6],
                    match[7]
                );
                if (!checkWeekday(match[1], parsedArray, config)) {
                    return;
                }

                config._a = parsedArray;
                config._tzm = calculateOffset(match[8], match[9], match[10]);

                config._d = createUTCDate.apply(null, config._a);
                config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

                getParsingFlags(config).rfc2822 = true;
            } else {
                config._isValid = false;
            }
        }

        // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
        function configFromString(config) {
            var matched = aspNetJsonRegex.exec(config._i);
            if (matched !== null) {
                config._d = new Date(+matched[1]);
                return;
            }

            configFromISO(config);
            if (config._isValid === false) {
                delete config._isValid;
            } else {
                return;
            }

            configFromRFC2822(config);
            if (config._isValid === false) {
                delete config._isValid;
            } else {
                return;
            }

            if (config._strict) {
                config._isValid = false;
            } else {
                // Final attempt, use Input Fallback
                hooks.createFromInputFallback(config);
            }
        }

        hooks.createFromInputFallback = deprecate(
            'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
                'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
                'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
            function (config) {
                config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
            }
        );

        // Pick the first defined of two or three arguments.
        function defaults(a, b, c) {
            if (a != null) {
                return a;
            }
            if (b != null) {
                return b;
            }
            return c;
        }

        function currentDateArray(config) {
            // hooks is actually the exported moment object
            var nowValue = new Date(hooks.now());
            if (config._useUTC) {
                return [
                    nowValue.getUTCFullYear(),
                    nowValue.getUTCMonth(),
                    nowValue.getUTCDate(),
                ];
            }
            return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
        }

        // convert an array to a date.
        // the array should mirror the parameters below
        // note: all values past the year are optional and will default to the lowest possible value.
        // [year, month, day , hour, minute, second, millisecond]
        function configFromArray(config) {
            var i,
                date,
                input = [],
                currentDate,
                expectedWeekday,
                yearToUse;

            if (config._d) {
                return;
            }

            currentDate = currentDateArray(config);

            //compute day of the year from weeks and weekdays
            if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                dayOfYearFromWeekInfo(config);
            }

            //if the day of the year is set, figure out what it is
            if (config._dayOfYear != null) {
                yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

                if (
                    config._dayOfYear > daysInYear(yearToUse) ||
                    config._dayOfYear === 0
                ) {
                    getParsingFlags(config)._overflowDayOfYear = true;
                }

                date = createUTCDate(yearToUse, 0, config._dayOfYear);
                config._a[MONTH] = date.getUTCMonth();
                config._a[DATE] = date.getUTCDate();
            }

            // Default to current date.
            // * if no year, month, day of month are given, default to today
            // * if day of month is given, default month and year
            // * if month is given, default only year
            // * if year is given, don't default anything
            for (i = 0; i < 3 && config._a[i] == null; ++i) {
                config._a[i] = input[i] = currentDate[i];
            }

            // Zero out whatever was not defaulted, including time
            for (; i < 7; i++) {
                config._a[i] = input[i] =
                    config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
            }

            // Check for 24:00:00.000
            if (
                config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0
            ) {
                config._nextDay = true;
                config._a[HOUR] = 0;
            }

            config._d = (config._useUTC ? createUTCDate : createDate).apply(
                null,
                input
            );
            expectedWeekday = config._useUTC
                ? config._d.getUTCDay()
                : config._d.getDay();

            // Apply timezone offset from input. The actual utcOffset can be changed
            // with parseZone.
            if (config._tzm != null) {
                config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
            }

            if (config._nextDay) {
                config._a[HOUR] = 24;
            }

            // check for mismatching day of week
            if (
                config._w &&
                typeof config._w.d !== 'undefined' &&
                config._w.d !== expectedWeekday
            ) {
                getParsingFlags(config).weekdayMismatch = true;
            }
        }

        function dayOfYearFromWeekInfo(config) {
            var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                dow = 1;
                doy = 4;

                // TODO: We need to take the current isoWeekYear, but that depends on
                // how we interpret now (local, utc, fixed offset). So create
                // a now version of current config (take local/utc/offset flags, and
                // create now).
                weekYear = defaults(
                    w.GG,
                    config._a[YEAR],
                    weekOfYear(createLocal(), 1, 4).year
                );
                week = defaults(w.W, 1);
                weekday = defaults(w.E, 1);
                if (weekday < 1 || weekday > 7) {
                    weekdayOverflow = true;
                }
            } else {
                dow = config._locale._week.dow;
                doy = config._locale._week.doy;

                curWeek = weekOfYear(createLocal(), dow, doy);

                weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

                // Default to current week.
                week = defaults(w.w, curWeek.week);

                if (w.d != null) {
                    // weekday -- low day numbers are considered next week
                    weekday = w.d;
                    if (weekday < 0 || weekday > 6) {
                        weekdayOverflow = true;
                    }
                } else if (w.e != null) {
                    // local weekday -- counting starts from beginning of week
                    weekday = w.e + dow;
                    if (w.e < 0 || w.e > 6) {
                        weekdayOverflow = true;
                    }
                } else {
                    // default to beginning of week
                    weekday = dow;
                }
            }
            if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
                getParsingFlags(config)._overflowWeeks = true;
            } else if (weekdayOverflow != null) {
                getParsingFlags(config)._overflowWeekday = true;
            } else {
                temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
                config._a[YEAR] = temp.year;
                config._dayOfYear = temp.dayOfYear;
            }
        }

        // constant that refers to the ISO standard
        hooks.ISO_8601 = function () {};

        // constant that refers to the RFC 2822 form
        hooks.RFC_2822 = function () {};

        // date from string and format string
        function configFromStringAndFormat(config) {
            // TODO: Move this to another part of the creation flow to prevent circular deps
            if (config._f === hooks.ISO_8601) {
                configFromISO(config);
                return;
            }
            if (config._f === hooks.RFC_2822) {
                configFromRFC2822(config);
                return;
            }
            config._a = [];
            getParsingFlags(config).empty = true;

            // This array is used to make a Date, either with `new Date` or `Date.UTC`
            var string = '' + config._i,
                i,
                parsedInput,
                tokens,
                token,
                skipped,
                stringLength = string.length,
                totalParsedInputLength = 0,
                era,
                tokenLen;

            tokens =
                expandFormat(config._f, config._locale).match(formattingTokens) || [];
            tokenLen = tokens.length;
            for (i = 0; i < tokenLen; i++) {
                token = tokens[i];
                parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                    [])[0];
                if (parsedInput) {
                    skipped = string.substr(0, string.indexOf(parsedInput));
                    if (skipped.length > 0) {
                        getParsingFlags(config).unusedInput.push(skipped);
                    }
                    string = string.slice(
                        string.indexOf(parsedInput) + parsedInput.length
                    );
                    totalParsedInputLength += parsedInput.length;
                }
                // don't parse if it's not a known token
                if (formatTokenFunctions[token]) {
                    if (parsedInput) {
                        getParsingFlags(config).empty = false;
                    } else {
                        getParsingFlags(config).unusedTokens.push(token);
                    }
                    addTimeToArrayFromToken(token, parsedInput, config);
                } else if (config._strict && !parsedInput) {
                    getParsingFlags(config).unusedTokens.push(token);
                }
            }

            // add remaining unparsed input length to the string
            getParsingFlags(config).charsLeftOver =
                stringLength - totalParsedInputLength;
            if (string.length > 0) {
                getParsingFlags(config).unusedInput.push(string);
            }

            // clear _12h flag if hour is <= 12
            if (
                config._a[HOUR] <= 12 &&
                getParsingFlags(config).bigHour === true &&
                config._a[HOUR] > 0
            ) {
                getParsingFlags(config).bigHour = undefined;
            }

            getParsingFlags(config).parsedDateParts = config._a.slice(0);
            getParsingFlags(config).meridiem = config._meridiem;
            // handle meridiem
            config._a[HOUR] = meridiemFixWrap(
                config._locale,
                config._a[HOUR],
                config._meridiem
            );

            // handle era
            era = getParsingFlags(config).era;
            if (era !== null) {
                config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
            }

            configFromArray(config);
            checkOverflow(config);
        }

        function meridiemFixWrap(locale, hour, meridiem) {
            var isPm;

            if (meridiem == null) {
                // nothing to do
                return hour;
            }
            if (locale.meridiemHour != null) {
                return locale.meridiemHour(hour, meridiem);
            } else if (locale.isPM != null) {
                // Fallback
                isPm = locale.isPM(meridiem);
                if (isPm && hour < 12) {
                    hour += 12;
                }
                if (!isPm && hour === 12) {
                    hour = 0;
                }
                return hour;
            } else {
                // this is not supposed to happen
                return hour;
            }
        }

        // date from string and array of format strings
        function configFromStringAndArray(config) {
            var tempConfig,
                bestMoment,
                scoreToBeat,
                i,
                currentScore,
                validFormatFound,
                bestFormatIsValid = false,
                configfLen = config._f.length;

            if (configfLen === 0) {
                getParsingFlags(config).invalidFormat = true;
                config._d = new Date(NaN);
                return;
            }

            for (i = 0; i < configfLen; i++) {
                currentScore = 0;
                validFormatFound = false;
                tempConfig = copyConfig({}, config);
                if (config._useUTC != null) {
                    tempConfig._useUTC = config._useUTC;
                }
                tempConfig._f = config._f[i];
                configFromStringAndFormat(tempConfig);

                if (isValid(tempConfig)) {
                    validFormatFound = true;
                }

                // if there is any input that was not parsed add a penalty for that format
                currentScore += getParsingFlags(tempConfig).charsLeftOver;

                //or tokens
                currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

                getParsingFlags(tempConfig).score = currentScore;

                if (!bestFormatIsValid) {
                    if (
                        scoreToBeat == null ||
                        currentScore < scoreToBeat ||
                        validFormatFound
                    ) {
                        scoreToBeat = currentScore;
                        bestMoment = tempConfig;
                        if (validFormatFound) {
                            bestFormatIsValid = true;
                        }
                    }
                } else {
                    if (currentScore < scoreToBeat) {
                        scoreToBeat = currentScore;
                        bestMoment = tempConfig;
                    }
                }
            }

            extend(config, bestMoment || tempConfig);
        }

        function configFromObject(config) {
            if (config._d) {
                return;
            }

            var i = normalizeObjectUnits(config._i),
                dayOrDate = i.day === undefined ? i.date : i.day;
            config._a = map(
                [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
                function (obj) {
                    return obj && parseInt(obj, 10);
                }
            );

            configFromArray(config);
        }

        function createFromConfig(config) {
            var res = new Moment(checkOverflow(prepareConfig(config)));
            if (res._nextDay) {
                // Adding is smart enough around DST
                res.add(1, 'd');
                res._nextDay = undefined;
            }

            return res;
        }

        function prepareConfig(config) {
            var input = config._i,
                format = config._f;

            config._locale = config._locale || getLocale(config._l);

            if (input === null || (format === undefined && input === '')) {
                return createInvalid({ nullInput: true });
            }

            if (typeof input === 'string') {
                config._i = input = config._locale.preparse(input);
            }

            if (isMoment(input)) {
                return new Moment(checkOverflow(input));
            } else if (isDate(input)) {
                config._d = input;
            } else if (isArray(format)) {
                configFromStringAndArray(config);
            } else if (format) {
                configFromStringAndFormat(config);
            } else {
                configFromInput(config);
            }

            if (!isValid(config)) {
                config._d = null;
            }

            return config;
        }

        function configFromInput(config) {
            var input = config._i;
            if (isUndefined(input)) {
                config._d = new Date(hooks.now());
            } else if (isDate(input)) {
                config._d = new Date(input.valueOf());
            } else if (typeof input === 'string') {
                configFromString(config);
            } else if (isArray(input)) {
                config._a = map(input.slice(0), function (obj) {
                    return parseInt(obj, 10);
                });
                configFromArray(config);
            } else if (isObject(input)) {
                configFromObject(config);
            } else if (isNumber(input)) {
                // from milliseconds
                config._d = new Date(input);
            } else {
                hooks.createFromInputFallback(config);
            }
        }

        function createLocalOrUTC(input, format, locale, strict, isUTC) {
            var c = {};

            if (format === true || format === false) {
                strict = format;
                format = undefined;
            }

            if (locale === true || locale === false) {
                strict = locale;
                locale = undefined;
            }

            if (
                (isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)
            ) {
                input = undefined;
            }
            // object construction must be done this way.
            // https://github.com/moment/moment/issues/1423
            c._isAMomentObject = true;
            c._useUTC = c._isUTC = isUTC;
            c._l = locale;
            c._i = input;
            c._f = format;
            c._strict = strict;

            return createFromConfig(c);
        }

        function createLocal(input, format, locale, strict) {
            return createLocalOrUTC(input, format, locale, strict, false);
        }

        var prototypeMin = deprecate(
                'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
                function () {
                    var other = createLocal.apply(null, arguments);
                    if (this.isValid() && other.isValid()) {
                        return other < this ? this : other;
                    } else {
                        return createInvalid();
                    }
                }
            ),
            prototypeMax = deprecate(
                'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
                function () {
                    var other = createLocal.apply(null, arguments);
                    if (this.isValid() && other.isValid()) {
                        return other > this ? this : other;
                    } else {
                        return createInvalid();
                    }
                }
            );

        // Pick a moment m from moments so that m[fn](other) is true for all
        // other. This relies on the function fn to be transitive.
        //
        // moments should either be an array of moment objects or an array, whose
        // first element is an array of moment objects.
        function pickBy(fn, moments) {
            var res, i;
            if (moments.length === 1 && isArray(moments[0])) {
                moments = moments[0];
            }
            if (!moments.length) {
                return createLocal();
            }
            res = moments[0];
            for (i = 1; i < moments.length; ++i) {
                if (!moments[i].isValid() || moments[i][fn](res)) {
                    res = moments[i];
                }
            }
            return res;
        }

        // TODO: Use [].sort instead?
        function min() {
            var args = [].slice.call(arguments, 0);

            return pickBy('isBefore', args);
        }

        function max() {
            var args = [].slice.call(arguments, 0);

            return pickBy('isAfter', args);
        }

        var now = function () {
            return Date.now ? Date.now() : +new Date();
        };

        var ordering = [
            'year',
            'quarter',
            'month',
            'week',
            'day',
            'hour',
            'minute',
            'second',
            'millisecond',
        ];

        function isDurationValid(m) {
            var key,
                unitHasDecimal = false,
                i,
                orderLen = ordering.length;
            for (key in m) {
                if (
                    hasOwnProp(m, key) &&
                    !(
                        indexOf.call(ordering, key) !== -1 &&
                        (m[key] == null || !isNaN(m[key]))
                    )
                ) {
                    return false;
                }
            }

            for (i = 0; i < orderLen; ++i) {
                if (m[ordering[i]]) {
                    if (unitHasDecimal) {
                        return false; // only allow non-integers for smallest unit
                    }
                    if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                        unitHasDecimal = true;
                    }
                }
            }

            return true;
        }

        function isValid$1() {
            return this._isValid;
        }

        function createInvalid$1() {
            return createDuration(NaN);
        }

        function Duration(duration) {
            var normalizedInput = normalizeObjectUnits(duration),
                years = normalizedInput.year || 0,
                quarters = normalizedInput.quarter || 0,
                months = normalizedInput.month || 0,
                weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
                days = normalizedInput.day || 0,
                hours = normalizedInput.hour || 0,
                minutes = normalizedInput.minute || 0,
                seconds = normalizedInput.second || 0,
                milliseconds = normalizedInput.millisecond || 0;

            this._isValid = isDurationValid(normalizedInput);

            // representation for dateAddRemove
            this._milliseconds =
                +milliseconds +
                seconds * 1e3 + // 1000
                minutes * 6e4 + // 1000 * 60
                hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
            // Because of dateAddRemove treats 24 hours as different from a
            // day when working around DST, we need to store them separately
            this._days = +days + weeks * 7;
            // It is impossible to translate months into days without knowing
            // which months you are are talking about, so we have to store
            // it separately.
            this._months = +months + quarters * 3 + years * 12;

            this._data = {};

            this._locale = getLocale();

            this._bubble();
        }

        function isDuration(obj) {
            return obj instanceof Duration;
        }

        function absRound(number) {
            if (number < 0) {
                return Math.round(-1 * number) * -1;
            } else {
                return Math.round(number);
            }
        }

        // compare two arrays, return the number of differences
        function compareArrays(array1, array2, dontConvert) {
            var len = Math.min(array1.length, array2.length),
                lengthDiff = Math.abs(array1.length - array2.length),
                diffs = 0,
                i;
            for (i = 0; i < len; i++) {
                if (
                    (dontConvert && array1[i] !== array2[i]) ||
                    (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
                ) {
                    diffs++;
                }
            }
            return diffs + lengthDiff;
        }

        // FORMATTING

        function offset(token, separator) {
            addFormatToken(token, 0, 0, function () {
                var offset = this.utcOffset(),
                    sign = '+';
                if (offset < 0) {
                    offset = -offset;
                    sign = '-';
                }
                return (
                    sign +
                    zeroFill(~~(offset / 60), 2) +
                    separator +
                    zeroFill(~~offset % 60, 2)
                );
            });
        }

        offset('Z', ':');
        offset('ZZ', '');

        // PARSING

        addRegexToken('Z', matchShortOffset);
        addRegexToken('ZZ', matchShortOffset);
        addParseToken(['Z', 'ZZ'], function (input, array, config) {
            config._useUTC = true;
            config._tzm = offsetFromString(matchShortOffset, input);
        });

        // HELPERS

        // timezone chunker
        // '+10:00' > ['10',  '00']
        // '-1530'  > ['-15', '30']
        var chunkOffset = /([\+\-]|\d\d)/gi;

        function offsetFromString(matcher, string) {
            var matches = (string || '').match(matcher),
                chunk,
                parts,
                minutes;

            if (matches === null) {
                return null;
            }

            chunk = matches[matches.length - 1] || [];
            parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
            minutes = +(parts[1] * 60) + toInt(parts[2]);

            return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
        }

        // Return a moment from input, that is local/utc/zone equivalent to model.
        function cloneWithOffset(input, model) {
            var res, diff;
            if (model._isUTC) {
                res = model.clone();
                diff =
                    (isMoment(input) || isDate(input)
                        ? input.valueOf()
                        : createLocal(input).valueOf()) - res.valueOf();
                // Use low-level api, because this fn is low-level api.
                res._d.setTime(res._d.valueOf() + diff);
                hooks.updateOffset(res, false);
                return res;
            } else {
                return createLocal(input).local();
            }
        }

        function getDateOffset(m) {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return -Math.round(m._d.getTimezoneOffset());
        }

        // HOOKS

        // This function will be called whenever a moment is mutated.
        // It is intended to keep the offset in sync with the timezone.
        hooks.updateOffset = function () {};

        // MOMENTS

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        function getSetOffset(input, keepLocalTime, keepMinutes) {
            var offset = this._offset || 0,
                localAdjust;
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }
            if (input != null) {
                if (typeof input === 'string') {
                    input = offsetFromString(matchShortOffset, input);
                    if (input === null) {
                        return this;
                    }
                } else if (Math.abs(input) < 16 && !keepMinutes) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = getDateOffset(this);
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addSubtract(
                            this,
                            createDuration(input - offset, 'm'),
                            1,
                            false
                        );
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        hooks.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
                return this;
            } else {
                return this._isUTC ? offset : getDateOffset(this);
            }
        }

        function getSetZone(input, keepLocalTime) {
            if (input != null) {
                if (typeof input !== 'string') {
                    input = -input;
                }

                this.utcOffset(input, keepLocalTime);

                return this;
            } else {
                return -this.utcOffset();
            }
        }

        function setOffsetToUTC(keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        }

        function setOffsetToLocal(keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(getDateOffset(this), 'm');
                }
            }
            return this;
        }

        function setOffsetToParsedOffset() {
            if (this._tzm != null) {
                this.utcOffset(this._tzm, false, true);
            } else if (typeof this._i === 'string') {
                var tZone = offsetFromString(matchOffset, this._i);
                if (tZone != null) {
                    this.utcOffset(tZone);
                } else {
                    this.utcOffset(0, true);
                }
            }
            return this;
        }

        function hasAlignedHourOffset(input) {
            if (!this.isValid()) {
                return false;
            }
            input = input ? createLocal(input).utcOffset() : 0;

            return (this.utcOffset() - input) % 60 === 0;
        }

        function isDaylightSavingTime() {
            return (
                this.utcOffset() > this.clone().month(0).utcOffset() ||
                this.utcOffset() > this.clone().month(5).utcOffset()
            );
        }

        function isDaylightSavingTimeShifted() {
            if (!isUndefined(this._isDSTShifted)) {
                return this._isDSTShifted;
            }

            var c = {},
                other;

            copyConfig(c, this);
            c = prepareConfig(c);

            if (c._a) {
                other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
                this._isDSTShifted =
                    this.isValid() && compareArrays(c._a, other.toArray()) > 0;
            } else {
                this._isDSTShifted = false;
            }

            return this._isDSTShifted;
        }

        function isLocal() {
            return this.isValid() ? !this._isUTC : false;
        }

        function isUtcOffset() {
            return this.isValid() ? this._isUTC : false;
        }

        function isUtc() {
            return this.isValid() ? this._isUTC && this._offset === 0 : false;
        }

        // ASP.NET json date format regex
        var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
            // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
            // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
            // and further modified to allow for strings containing both week and day
            isoRegex =
                /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

        function createDuration(input, key) {
            var duration = input,
                // matching against regexp is expensive, do it on demand
                match = null,
                sign,
                ret,
                diffRes;

            if (isDuration(input)) {
                duration = {
                    ms: input._milliseconds,
                    d: input._days,
                    M: input._months,
                };
            } else if (isNumber(input) || !isNaN(+input)) {
                duration = {};
                if (key) {
                    duration[key] = +input;
                } else {
                    duration.milliseconds = +input;
                }
            } else if ((match = aspNetRegex.exec(input))) {
                sign = match[1] === '-' ? -1 : 1;
                duration = {
                    y: 0,
                    d: toInt(match[DATE]) * sign,
                    h: toInt(match[HOUR]) * sign,
                    m: toInt(match[MINUTE]) * sign,
                    s: toInt(match[SECOND]) * sign,
                    ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
                };
            } else if ((match = isoRegex.exec(input))) {
                sign = match[1] === '-' ? -1 : 1;
                duration = {
                    y: parseIso(match[2], sign),
                    M: parseIso(match[3], sign),
                    w: parseIso(match[4], sign),
                    d: parseIso(match[5], sign),
                    h: parseIso(match[6], sign),
                    m: parseIso(match[7], sign),
                    s: parseIso(match[8], sign),
                };
            } else if (duration == null) {
                // checks for null or undefined
                duration = {};
            } else if (
                typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)
            ) {
                diffRes = momentsDifference(
                    createLocal(duration.from),
                    createLocal(duration.to)
                );

                duration = {};
                duration.ms = diffRes.milliseconds;
                duration.M = diffRes.months;
            }

            ret = new Duration(duration);

            if (isDuration(input) && hasOwnProp(input, '_locale')) {
                ret._locale = input._locale;
            }

            if (isDuration(input) && hasOwnProp(input, '_isValid')) {
                ret._isValid = input._isValid;
            }

            return ret;
        }

        createDuration.fn = Duration.prototype;
        createDuration.invalid = createInvalid$1;

        function parseIso(inp, sign) {
            // We'd normally use ~~inp for this, but unfortunately it also
            // converts floats to ints.
            // inp may be undefined, so careful calling replace on it.
            var res = inp && parseFloat(inp.replace(',', '.'));
            // apply sign while we're at it
            return (isNaN(res) ? 0 : res) * sign;
        }

        function positiveMomentsDifference(base, other) {
            var res = {};

            res.months =
                other.month() - base.month() + (other.year() - base.year()) * 12;
            if (base.clone().add(res.months, 'M').isAfter(other)) {
                --res.months;
            }

            res.milliseconds = +other - +base.clone().add(res.months, 'M');

            return res;
        }

        function momentsDifference(base, other) {
            var res;
            if (!(base.isValid() && other.isValid())) {
                return { milliseconds: 0, months: 0 };
            }

            other = cloneWithOffset(other, base);
            if (base.isBefore(other)) {
                res = positiveMomentsDifference(base, other);
            } else {
                res = positiveMomentsDifference(other, base);
                res.milliseconds = -res.milliseconds;
                res.months = -res.months;
            }

            return res;
        }

        // TODO: remove 'name' arg after deprecation is removed
        function createAdder(direction, name) {
            return function (val, period) {
                var dur, tmp;
                //invert the arguments, but complain about it
                if (period !== null && !isNaN(+period)) {
                    deprecateSimple(
                        name,
                        'moment().' +
                            name +
                            '(period, number) is deprecated. Please use moment().' +
                            name +
                            '(number, period). ' +
                            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                    );
                    tmp = val;
                    val = period;
                    period = tmp;
                }

                dur = createDuration(val, period);
                addSubtract(this, dur, direction);
                return this;
            };
        }

        function addSubtract(mom, duration, isAdding, updateOffset) {
            var milliseconds = duration._milliseconds,
                days = absRound(duration._days),
                months = absRound(duration._months);

            if (!mom.isValid()) {
                // No op
                return;
            }

            updateOffset = updateOffset == null ? true : updateOffset;

            if (months) {
                setMonth(mom, get(mom, 'Month') + months * isAdding);
            }
            if (days) {
                set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
            }
            if (milliseconds) {
                mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
            }
            if (updateOffset) {
                hooks.updateOffset(mom, days || months);
            }
        }

        var add = createAdder(1, 'add'),
            subtract = createAdder(-1, 'subtract');

        function isString(input) {
            return typeof input === 'string' || input instanceof String;
        }

        // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
        function isMomentInput(input) {
            return (
                isMoment(input) ||
                isDate(input) ||
                isString(input) ||
                isNumber(input) ||
                isNumberOrStringArray(input) ||
                isMomentInputObject(input) ||
                input === null ||
                input === undefined
            );
        }

        function isMomentInputObject(input) {
            var objectTest = isObject(input) && !isObjectEmpty(input),
                propertyTest = false,
                properties = [
                    'years',
                    'year',
                    'y',
                    'months',
                    'month',
                    'M',
                    'days',
                    'day',
                    'd',
                    'dates',
                    'date',
                    'D',
                    'hours',
                    'hour',
                    'h',
                    'minutes',
                    'minute',
                    'm',
                    'seconds',
                    'second',
                    's',
                    'milliseconds',
                    'millisecond',
                    'ms',
                ],
                i,
                property,
                propertyLen = properties.length;

            for (i = 0; i < propertyLen; i += 1) {
                property = properties[i];
                propertyTest = propertyTest || hasOwnProp(input, property);
            }

            return objectTest && propertyTest;
        }

        function isNumberOrStringArray(input) {
            var arrayTest = isArray(input),
                dataTypeTest = false;
            if (arrayTest) {
                dataTypeTest =
                    input.filter(function (item) {
                        return !isNumber(item) && isString(input);
                    }).length === 0;
            }
            return arrayTest && dataTypeTest;
        }

        function isCalendarSpec(input) {
            var objectTest = isObject(input) && !isObjectEmpty(input),
                propertyTest = false,
                properties = [
                    'sameDay',
                    'nextDay',
                    'lastDay',
                    'nextWeek',
                    'lastWeek',
                    'sameElse',
                ],
                i,
                property;

            for (i = 0; i < properties.length; i += 1) {
                property = properties[i];
                propertyTest = propertyTest || hasOwnProp(input, property);
            }

            return objectTest && propertyTest;
        }

        function getCalendarFormat(myMoment, now) {
            var diff = myMoment.diff(now, 'days', true);
            return diff < -6
                ? 'sameElse'
                : diff < -1
                ? 'lastWeek'
                : diff < 0
                ? 'lastDay'
                : diff < 1
                ? 'sameDay'
                : diff < 2
                ? 'nextDay'
                : diff < 7
                ? 'nextWeek'
                : 'sameElse';
        }

        function calendar$1(time, formats) {
            // Support for single parameter, formats only overload to the calendar function
            if (arguments.length === 1) {
                if (!arguments[0]) {
                    time = undefined;
                    formats = undefined;
                } else if (isMomentInput(arguments[0])) {
                    time = arguments[0];
                    formats = undefined;
                } else if (isCalendarSpec(arguments[0])) {
                    formats = arguments[0];
                    time = undefined;
                }
            }
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're local/utc/offset or not.
            var now = time || createLocal(),
                sod = cloneWithOffset(now, this).startOf('day'),
                format = hooks.calendarFormat(this, sod) || 'sameElse',
                output =
                    formats &&
                    (isFunction(formats[format])
                        ? formats[format].call(this, now)
                        : formats[format]);

            return this.format(
                output || this.localeData().calendar(format, this, createLocal(now))
            );
        }

        function clone() {
            return new Moment(this);
        }

        function isAfter(input, units) {
            var localInput = isMoment(input) ? input : createLocal(input);
            if (!(this.isValid() && localInput.isValid())) {
                return false;
            }
            units = normalizeUnits(units) || 'millisecond';
            if (units === 'millisecond') {
                return this.valueOf() > localInput.valueOf();
            } else {
                return localInput.valueOf() < this.clone().startOf(units).valueOf();
            }
        }

        function isBefore(input, units) {
            var localInput = isMoment(input) ? input : createLocal(input);
            if (!(this.isValid() && localInput.isValid())) {
                return false;
            }
            units = normalizeUnits(units) || 'millisecond';
            if (units === 'millisecond') {
                return this.valueOf() < localInput.valueOf();
            } else {
                return this.clone().endOf(units).valueOf() < localInput.valueOf();
            }
        }

        function isBetween(from, to, units, inclusivity) {
            var localFrom = isMoment(from) ? from : createLocal(from),
                localTo = isMoment(to) ? to : createLocal(to);
            if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
                return false;
            }
            inclusivity = inclusivity || '()';
            return (
                (inclusivity[0] === '('
                    ? this.isAfter(localFrom, units)
                    : !this.isBefore(localFrom, units)) &&
                (inclusivity[1] === ')'
                    ? this.isBefore(localTo, units)
                    : !this.isAfter(localTo, units))
            );
        }

        function isSame(input, units) {
            var localInput = isMoment(input) ? input : createLocal(input),
                inputMs;
            if (!(this.isValid() && localInput.isValid())) {
                return false;
            }
            units = normalizeUnits(units) || 'millisecond';
            if (units === 'millisecond') {
                return this.valueOf() === localInput.valueOf();
            } else {
                inputMs = localInput.valueOf();
                return (
                    this.clone().startOf(units).valueOf() <= inputMs &&
                    inputMs <= this.clone().endOf(units).valueOf()
                );
            }
        }

        function isSameOrAfter(input, units) {
            return this.isSame(input, units) || this.isAfter(input, units);
        }

        function isSameOrBefore(input, units) {
            return this.isSame(input, units) || this.isBefore(input, units);
        }

        function diff(input, units, asFloat) {
            var that, zoneDelta, output;

            if (!this.isValid()) {
                return NaN;
            }

            that = cloneWithOffset(input, this);

            if (!that.isValid()) {
                return NaN;
            }

            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

            units = normalizeUnits(units);

            switch (units) {
                case 'year':
                    output = monthDiff(this, that) / 12;
                    break;
                case 'month':
                    output = monthDiff(this, that);
                    break;
                case 'quarter':
                    output = monthDiff(this, that) / 3;
                    break;
                case 'second':
                    output = (this - that) / 1e3;
                    break; // 1000
                case 'minute':
                    output = (this - that) / 6e4;
                    break; // 1000 * 60
                case 'hour':
                    output = (this - that) / 36e5;
                    break; // 1000 * 60 * 60
                case 'day':
                    output = (this - that - zoneDelta) / 864e5;
                    break; // 1000 * 60 * 60 * 24, negate dst
                case 'week':
                    output = (this - that - zoneDelta) / 6048e5;
                    break; // 1000 * 60 * 60 * 24 * 7, negate dst
                default:
                    output = this - that;
            }

            return asFloat ? output : absFloor(output);
        }

        function monthDiff(a, b) {
            if (a.date() < b.date()) {
                // end-of-month calculations work correct when the start month has more
                // days than the end month.
                return -monthDiff(b, a);
            }
            // difference in months
            var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
                // b is in (anchor - 1 month, anchor + 1 month)
                anchor = a.clone().add(wholeMonthDiff, 'months'),
                anchor2,
                adjust;

            if (b - anchor < 0) {
                anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
                // linear across the month
                adjust = (b - anchor) / (anchor - anchor2);
            } else {
                anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
                // linear across the month
                adjust = (b - anchor) / (anchor2 - anchor);
            }

            //check for negative zero, return zero if negative zero
            return -(wholeMonthDiff + adjust) || 0;
        }

        hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
        hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

        function toString() {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        }

        function toISOString(keepOffset) {
            if (!this.isValid()) {
                return null;
            }
            var utc = keepOffset !== true,
                m = utc ? this.clone().utc() : this;
            if (m.year() < 0 || m.year() > 9999) {
                return formatMoment(
                    m,
                    utc
                        ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                        : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
                );
            }
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                if (utc) {
                    return this.toDate().toISOString();
                } else {
                    return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                        .toISOString()
                        .replace('Z', formatMoment(m, 'Z'));
                }
            }
            return formatMoment(
                m,
                utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }

        /**
         * Return a human readable representation of a moment that can
         * also be evaluated to get a new moment which is the same
         *
         * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
         */
        function inspect() {
            if (!this.isValid()) {
                return 'moment.invalid(/* ' + this._i + ' */)';
            }
            var func = 'moment',
                zone = '',
                prefix,
                year,
                datetime,
                suffix;
            if (!this.isLocal()) {
                func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
                zone = 'Z';
            }
            prefix = '[' + func + '("]';
            year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
            datetime = '-MM-DD[T]HH:mm:ss.SSS';
            suffix = zone + '[")]';

            return this.format(prefix + year + datetime + suffix);
        }

        function format(inputString) {
            if (!inputString) {
                inputString = this.isUtc()
                    ? hooks.defaultFormatUtc
                    : hooks.defaultFormat;
            }
            var output = formatMoment(this, inputString);
            return this.localeData().postformat(output);
        }

        function from(time, withoutSuffix) {
            if (
                this.isValid() &&
                ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
            ) {
                return createDuration({ to: this, from: time })
                    .locale(this.locale())
                    .humanize(!withoutSuffix);
            } else {
                return this.localeData().invalidDate();
            }
        }

        function fromNow(withoutSuffix) {
            return this.from(createLocal(), withoutSuffix);
        }

        function to(time, withoutSuffix) {
            if (
                this.isValid() &&
                ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
            ) {
                return createDuration({ from: this, to: time })
                    .locale(this.locale())
                    .humanize(!withoutSuffix);
            } else {
                return this.localeData().invalidDate();
            }
        }

        function toNow(withoutSuffix) {
            return this.to(createLocal(), withoutSuffix);
        }

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        function locale(key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = getLocale(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        }

        var lang = deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        );

        function localeData() {
            return this._locale;
        }

        var MS_PER_SECOND = 1000,
            MS_PER_MINUTE = 60 * MS_PER_SECOND,
            MS_PER_HOUR = 60 * MS_PER_MINUTE,
            MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

        // actual modulo - handles negative numbers (for dates before 1970):
        function mod$1(dividend, divisor) {
            return ((dividend % divisor) + divisor) % divisor;
        }

        function localStartOfDate(y, m, d) {
            // the date constructor remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                // preserve leap years using a full 400 year cycle, then reset
                return new Date(y + 400, m, d) - MS_PER_400_YEARS;
            } else {
                return new Date(y, m, d).valueOf();
            }
        }

        function utcStartOfDate(y, m, d) {
            // Date.UTC remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                // preserve leap years using a full 400 year cycle, then reset
                return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
            } else {
                return Date.UTC(y, m, d);
            }
        }

        function startOf(units) {
            var time, startOfDate;
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond' || !this.isValid()) {
                return this;
            }

            startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

            switch (units) {
                case 'year':
                    time = startOfDate(this.year(), 0, 1);
                    break;
                case 'quarter':
                    time = startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3),
                        1
                    );
                    break;
                case 'month':
                    time = startOfDate(this.year(), this.month(), 1);
                    break;
                case 'week':
                    time = startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday()
                    );
                    break;
                case 'isoWeek':
                    time = startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1)
                    );
                    break;
                case 'day':
                case 'date':
                    time = startOfDate(this.year(), this.month(), this.date());
                    break;
                case 'hour':
                    time = this._d.valueOf();
                    time -= mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    );
                    break;
                case 'minute':
                    time = this._d.valueOf();
                    time -= mod$1(time, MS_PER_MINUTE);
                    break;
                case 'second':
                    time = this._d.valueOf();
                    time -= mod$1(time, MS_PER_SECOND);
                    break;
            }

            this._d.setTime(time);
            hooks.updateOffset(this, true);
            return this;
        }

        function endOf(units) {
            var time, startOfDate;
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond' || !this.isValid()) {
                return this;
            }

            startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

            switch (units) {
                case 'year':
                    time = startOfDate(this.year() + 1, 0, 1) - 1;
                    break;
                case 'quarter':
                    time =
                        startOfDate(
                            this.year(),
                            this.month() - (this.month() % 3) + 3,
                            1
                        ) - 1;
                    break;
                case 'month':
                    time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                    break;
                case 'week':
                    time =
                        startOfDate(
                            this.year(),
                            this.month(),
                            this.date() - this.weekday() + 7
                        ) - 1;
                    break;
                case 'isoWeek':
                    time =
                        startOfDate(
                            this.year(),
                            this.month(),
                            this.date() - (this.isoWeekday() - 1) + 7
                        ) - 1;
                    break;
                case 'day':
                case 'date':
                    time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                    break;
                case 'hour':
                    time = this._d.valueOf();
                    time +=
                        MS_PER_HOUR -
                        mod$1(
                            time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                            MS_PER_HOUR
                        ) -
                        1;
                    break;
                case 'minute':
                    time = this._d.valueOf();
                    time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                    break;
                case 'second':
                    time = this._d.valueOf();
                    time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                    break;
            }

            this._d.setTime(time);
            hooks.updateOffset(this, true);
            return this;
        }

        function valueOf() {
            return this._d.valueOf() - (this._offset || 0) * 60000;
        }

        function unix() {
            return Math.floor(this.valueOf() / 1000);
        }

        function toDate() {
            return new Date(this.valueOf());
        }

        function toArray() {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hour(),
                m.minute(),
                m.second(),
                m.millisecond(),
            ];
        }

        function toObject() {
            var m = this;
            return {
                years: m.year(),
                months: m.month(),
                date: m.date(),
                hours: m.hours(),
                minutes: m.minutes(),
                seconds: m.seconds(),
                milliseconds: m.milliseconds(),
            };
        }

        function toJSON() {
            // new Date(NaN).toJSON() === null
            return this.isValid() ? this.toISOString() : null;
        }

        function isValid$2() {
            return isValid(this);
        }

        function parsingFlags() {
            return extend({}, getParsingFlags(this));
        }

        function invalidAt() {
            return getParsingFlags(this).overflow;
        }

        function creationData() {
            return {
                input: this._i,
                format: this._f,
                locale: this._locale,
                isUTC: this._isUTC,
                strict: this._strict,
            };
        }

        addFormatToken('N', 0, 0, 'eraAbbr');
        addFormatToken('NN', 0, 0, 'eraAbbr');
        addFormatToken('NNN', 0, 0, 'eraAbbr');
        addFormatToken('NNNN', 0, 0, 'eraName');
        addFormatToken('NNNNN', 0, 0, 'eraNarrow');

        addFormatToken('y', ['y', 1], 'yo', 'eraYear');
        addFormatToken('y', ['yy', 2], 0, 'eraYear');
        addFormatToken('y', ['yyy', 3], 0, 'eraYear');
        addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

        addRegexToken('N', matchEraAbbr);
        addRegexToken('NN', matchEraAbbr);
        addRegexToken('NNN', matchEraAbbr);
        addRegexToken('NNNN', matchEraName);
        addRegexToken('NNNNN', matchEraNarrow);

        addParseToken(
            ['N', 'NN', 'NNN', 'NNNN', 'NNNNN'],
            function (input, array, config, token) {
                var era = config._locale.erasParse(input, token, config._strict);
                if (era) {
                    getParsingFlags(config).era = era;
                } else {
                    getParsingFlags(config).invalidEra = input;
                }
            }
        );

        addRegexToken('y', matchUnsigned);
        addRegexToken('yy', matchUnsigned);
        addRegexToken('yyy', matchUnsigned);
        addRegexToken('yyyy', matchUnsigned);
        addRegexToken('yo', matchEraYearOrdinal);

        addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
        addParseToken(['yo'], function (input, array, config, token) {
            var match;
            if (config._locale._eraYearOrdinalRegex) {
                match = input.match(config._locale._eraYearOrdinalRegex);
            }

            if (config._locale.eraYearOrdinalParse) {
                array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
            } else {
                array[YEAR] = parseInt(input, 10);
            }
        });

        function localeEras(m, format) {
            var i,
                l,
                date,
                eras = this._eras || getLocale('en')._eras;
            for (i = 0, l = eras.length; i < l; ++i) {
                switch (typeof eras[i].since) {
                    case 'string':
                        // truncate time
                        date = hooks(eras[i].since).startOf('day');
                        eras[i].since = date.valueOf();
                        break;
                }

                switch (typeof eras[i].until) {
                    case 'undefined':
                        eras[i].until = +Infinity;
                        break;
                    case 'string':
                        // truncate time
                        date = hooks(eras[i].until).startOf('day').valueOf();
                        eras[i].until = date.valueOf();
                        break;
                }
            }
            return eras;
        }

        function localeErasParse(eraName, format, strict) {
            var i,
                l,
                eras = this.eras(),
                name,
                abbr,
                narrow;
            eraName = eraName.toUpperCase();

            for (i = 0, l = eras.length; i < l; ++i) {
                name = eras[i].name.toUpperCase();
                abbr = eras[i].abbr.toUpperCase();
                narrow = eras[i].narrow.toUpperCase();

                if (strict) {
                    switch (format) {
                        case 'N':
                        case 'NN':
                        case 'NNN':
                            if (abbr === eraName) {
                                return eras[i];
                            }
                            break;

                        case 'NNNN':
                            if (name === eraName) {
                                return eras[i];
                            }
                            break;

                        case 'NNNNN':
                            if (narrow === eraName) {
                                return eras[i];
                            }
                            break;
                    }
                } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                    return eras[i];
                }
            }
        }

        function localeErasConvertYear(era, year) {
            var dir = era.since <= era.until ? +1 : -1;
            if (year === undefined) {
                return hooks(era.since).year();
            } else {
                return hooks(era.since).year() + (year - era.offset) * dir;
            }
        }

        function getEraName() {
            var i,
                l,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (eras[i].since <= val && val <= eras[i].until) {
                    return eras[i].name;
                }
                if (eras[i].until <= val && val <= eras[i].since) {
                    return eras[i].name;
                }
            }

            return '';
        }

        function getEraNarrow() {
            var i,
                l,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (eras[i].since <= val && val <= eras[i].until) {
                    return eras[i].narrow;
                }
                if (eras[i].until <= val && val <= eras[i].since) {
                    return eras[i].narrow;
                }
            }

            return '';
        }

        function getEraAbbr() {
            var i,
                l,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (eras[i].since <= val && val <= eras[i].until) {
                    return eras[i].abbr;
                }
                if (eras[i].until <= val && val <= eras[i].since) {
                    return eras[i].abbr;
                }
            }

            return '';
        }

        function getEraYear() {
            var i,
                l,
                dir,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                dir = eras[i].since <= eras[i].until ? +1 : -1;

                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (
                    (eras[i].since <= val && val <= eras[i].until) ||
                    (eras[i].until <= val && val <= eras[i].since)
                ) {
                    return (
                        (this.year() - hooks(eras[i].since).year()) * dir +
                        eras[i].offset
                    );
                }
            }

            return this.year();
        }

        function erasNameRegex(isStrict) {
            if (!hasOwnProp(this, '_erasNameRegex')) {
                computeErasParse.call(this);
            }
            return isStrict ? this._erasNameRegex : this._erasRegex;
        }

        function erasAbbrRegex(isStrict) {
            if (!hasOwnProp(this, '_erasAbbrRegex')) {
                computeErasParse.call(this);
            }
            return isStrict ? this._erasAbbrRegex : this._erasRegex;
        }

        function erasNarrowRegex(isStrict) {
            if (!hasOwnProp(this, '_erasNarrowRegex')) {
                computeErasParse.call(this);
            }
            return isStrict ? this._erasNarrowRegex : this._erasRegex;
        }

        function matchEraAbbr(isStrict, locale) {
            return locale.erasAbbrRegex(isStrict);
        }

        function matchEraName(isStrict, locale) {
            return locale.erasNameRegex(isStrict);
        }

        function matchEraNarrow(isStrict, locale) {
            return locale.erasNarrowRegex(isStrict);
        }

        function matchEraYearOrdinal(isStrict, locale) {
            return locale._eraYearOrdinalRegex || matchUnsigned;
        }

        function computeErasParse() {
            var abbrPieces = [],
                namePieces = [],
                narrowPieces = [],
                mixedPieces = [],
                i,
                l,
                eras = this.eras();

            for (i = 0, l = eras.length; i < l; ++i) {
                namePieces.push(regexEscape(eras[i].name));
                abbrPieces.push(regexEscape(eras[i].abbr));
                narrowPieces.push(regexEscape(eras[i].narrow));

                mixedPieces.push(regexEscape(eras[i].name));
                mixedPieces.push(regexEscape(eras[i].abbr));
                mixedPieces.push(regexEscape(eras[i].narrow));
            }

            this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
            this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
            this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
            this._erasNarrowRegex = new RegExp(
                '^(' + narrowPieces.join('|') + ')',
                'i'
            );
        }

        // FORMATTING

        addFormatToken(0, ['gg', 2], 0, function () {
            return this.weekYear() % 100;
        });

        addFormatToken(0, ['GG', 2], 0, function () {
            return this.isoWeekYear() % 100;
        });

        function addWeekYearFormatToken(token, getter) {
            addFormatToken(0, [token, token.length], 0, getter);
        }

        addWeekYearFormatToken('gggg', 'weekYear');
        addWeekYearFormatToken('ggggg', 'weekYear');
        addWeekYearFormatToken('GGGG', 'isoWeekYear');
        addWeekYearFormatToken('GGGGG', 'isoWeekYear');

        // ALIASES

        addUnitAlias('weekYear', 'gg');
        addUnitAlias('isoWeekYear', 'GG');

        // PRIORITY

        addUnitPriority('weekYear', 1);
        addUnitPriority('isoWeekYear', 1);

        // PARSING

        addRegexToken('G', matchSigned);
        addRegexToken('g', matchSigned);
        addRegexToken('GG', match1to2, match2);
        addRegexToken('gg', match1to2, match2);
        addRegexToken('GGGG', match1to4, match4);
        addRegexToken('gggg', match1to4, match4);
        addRegexToken('GGGGG', match1to6, match6);
        addRegexToken('ggggg', match1to6, match6);

        addWeekParseToken(
            ['gggg', 'ggggg', 'GGGG', 'GGGGG'],
            function (input, week, config, token) {
                week[token.substr(0, 2)] = toInt(input);
            }
        );

        addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
            week[token] = hooks.parseTwoDigitYear(input);
        });

        // MOMENTS

        function getSetWeekYear(input) {
            return getSetWeekYearHelper.call(
                this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy
            );
        }

        function getSetISOWeekYear(input) {
            return getSetWeekYearHelper.call(
                this,
                input,
                this.isoWeek(),
                this.isoWeekday(),
                1,
                4
            );
        }

        function getISOWeeksInYear() {
            return weeksInYear(this.year(), 1, 4);
        }

        function getISOWeeksInISOWeekYear() {
            return weeksInYear(this.isoWeekYear(), 1, 4);
        }

        function getWeeksInYear() {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        }

        function getWeeksInWeekYear() {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
        }

        function getSetWeekYearHelper(input, week, weekday, dow, doy) {
            var weeksTarget;
            if (input == null) {
                return weekOfYear(this, dow, doy).year;
            } else {
                weeksTarget = weeksInYear(input, dow, doy);
                if (week > weeksTarget) {
                    week = weeksTarget;
                }
                return setWeekAll.call(this, input, week, weekday, dow, doy);
            }
        }

        function setWeekAll(weekYear, week, weekday, dow, doy) {
            var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
                date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

            this.year(date.getUTCFullYear());
            this.month(date.getUTCMonth());
            this.date(date.getUTCDate());
            return this;
        }

        // FORMATTING

        addFormatToken('Q', 0, 'Qo', 'quarter');

        // ALIASES

        addUnitAlias('quarter', 'Q');

        // PRIORITY

        addUnitPriority('quarter', 7);

        // PARSING

        addRegexToken('Q', match1);
        addParseToken('Q', function (input, array) {
            array[MONTH] = (toInt(input) - 1) * 3;
        });

        // MOMENTS

        function getSetQuarter(input) {
            return input == null
                ? Math.ceil((this.month() + 1) / 3)
                : this.month((input - 1) * 3 + (this.month() % 3));
        }

        // FORMATTING

        addFormatToken('D', ['DD', 2], 'Do', 'date');

        // ALIASES

        addUnitAlias('date', 'D');

        // PRIORITY
        addUnitPriority('date', 9);

        // PARSING

        addRegexToken('D', match1to2);
        addRegexToken('DD', match1to2, match2);
        addRegexToken('Do', function (isStrict, locale) {
            // TODO: Remove "ordinalParse" fallback in next major release.
            return isStrict
                ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
                : locale._dayOfMonthOrdinalParseLenient;
        });

        addParseToken(['D', 'DD'], DATE);
        addParseToken('Do', function (input, array) {
            array[DATE] = toInt(input.match(match1to2)[0]);
        });

        // MOMENTS

        var getSetDayOfMonth = makeGetSet('Date', true);

        // FORMATTING

        addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

        // ALIASES

        addUnitAlias('dayOfYear', 'DDD');

        // PRIORITY
        addUnitPriority('dayOfYear', 4);

        // PARSING

        addRegexToken('DDD', match1to3);
        addRegexToken('DDDD', match3);
        addParseToken(['DDD', 'DDDD'], function (input, array, config) {
            config._dayOfYear = toInt(input);
        });

        // HELPERS

        // MOMENTS

        function getSetDayOfYear(input) {
            var dayOfYear =
                Math.round(
                    (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
                ) + 1;
            return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
        }

        // FORMATTING

        addFormatToken('m', ['mm', 2], 0, 'minute');

        // ALIASES

        addUnitAlias('minute', 'm');

        // PRIORITY

        addUnitPriority('minute', 14);

        // PARSING

        addRegexToken('m', match1to2);
        addRegexToken('mm', match1to2, match2);
        addParseToken(['m', 'mm'], MINUTE);

        // MOMENTS

        var getSetMinute = makeGetSet('Minutes', false);

        // FORMATTING

        addFormatToken('s', ['ss', 2], 0, 'second');

        // ALIASES

        addUnitAlias('second', 's');

        // PRIORITY

        addUnitPriority('second', 15);

        // PARSING

        addRegexToken('s', match1to2);
        addRegexToken('ss', match1to2, match2);
        addParseToken(['s', 'ss'], SECOND);

        // MOMENTS

        var getSetSecond = makeGetSet('Seconds', false);

        // FORMATTING

        addFormatToken('S', 0, 0, function () {
            return ~~(this.millisecond() / 100);
        });

        addFormatToken(0, ['SS', 2], 0, function () {
            return ~~(this.millisecond() / 10);
        });

        addFormatToken(0, ['SSS', 3], 0, 'millisecond');
        addFormatToken(0, ['SSSS', 4], 0, function () {
            return this.millisecond() * 10;
        });
        addFormatToken(0, ['SSSSS', 5], 0, function () {
            return this.millisecond() * 100;
        });
        addFormatToken(0, ['SSSSSS', 6], 0, function () {
            return this.millisecond() * 1000;
        });
        addFormatToken(0, ['SSSSSSS', 7], 0, function () {
            return this.millisecond() * 10000;
        });
        addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
            return this.millisecond() * 100000;
        });
        addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
            return this.millisecond() * 1000000;
        });

        // ALIASES

        addUnitAlias('millisecond', 'ms');

        // PRIORITY

        addUnitPriority('millisecond', 16);

        // PARSING

        addRegexToken('S', match1to3, match1);
        addRegexToken('SS', match1to3, match2);
        addRegexToken('SSS', match1to3, match3);

        var token, getSetMillisecond;
        for (token = 'SSSS'; token.length <= 9; token += 'S') {
            addRegexToken(token, matchUnsigned);
        }

        function parseMs(input, array) {
            array[MILLISECOND] = toInt(('0.' + input) * 1000);
        }

        for (token = 'S'; token.length <= 9; token += 'S') {
            addParseToken(token, parseMs);
        }

        getSetMillisecond = makeGetSet('Milliseconds', false);

        // FORMATTING

        addFormatToken('z', 0, 0, 'zoneAbbr');
        addFormatToken('zz', 0, 0, 'zoneName');

        // MOMENTS

        function getZoneAbbr() {
            return this._isUTC ? 'UTC' : '';
        }

        function getZoneName() {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        }

        var proto = Moment.prototype;

        proto.add = add;
        proto.calendar = calendar$1;
        proto.clone = clone;
        proto.diff = diff;
        proto.endOf = endOf;
        proto.format = format;
        proto.from = from;
        proto.fromNow = fromNow;
        proto.to = to;
        proto.toNow = toNow;
        proto.get = stringGet;
        proto.invalidAt = invalidAt;
        proto.isAfter = isAfter;
        proto.isBefore = isBefore;
        proto.isBetween = isBetween;
        proto.isSame = isSame;
        proto.isSameOrAfter = isSameOrAfter;
        proto.isSameOrBefore = isSameOrBefore;
        proto.isValid = isValid$2;
        proto.lang = lang;
        proto.locale = locale;
        proto.localeData = localeData;
        proto.max = prototypeMax;
        proto.min = prototypeMin;
        proto.parsingFlags = parsingFlags;
        proto.set = stringSet;
        proto.startOf = startOf;
        proto.subtract = subtract;
        proto.toArray = toArray;
        proto.toObject = toObject;
        proto.toDate = toDate;
        proto.toISOString = toISOString;
        proto.inspect = inspect;
        if (typeof Symbol !== 'undefined' && Symbol.for != null) {
            proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
                return 'Moment<' + this.format() + '>';
            };
        }
        proto.toJSON = toJSON;
        proto.toString = toString;
        proto.unix = unix;
        proto.valueOf = valueOf;
        proto.creationData = creationData;
        proto.eraName = getEraName;
        proto.eraNarrow = getEraNarrow;
        proto.eraAbbr = getEraAbbr;
        proto.eraYear = getEraYear;
        proto.year = getSetYear;
        proto.isLeapYear = getIsLeapYear;
        proto.weekYear = getSetWeekYear;
        proto.isoWeekYear = getSetISOWeekYear;
        proto.quarter = proto.quarters = getSetQuarter;
        proto.month = getSetMonth;
        proto.daysInMonth = getDaysInMonth;
        proto.week = proto.weeks = getSetWeek;
        proto.isoWeek = proto.isoWeeks = getSetISOWeek;
        proto.weeksInYear = getWeeksInYear;
        proto.weeksInWeekYear = getWeeksInWeekYear;
        proto.isoWeeksInYear = getISOWeeksInYear;
        proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
        proto.date = getSetDayOfMonth;
        proto.day = proto.days = getSetDayOfWeek;
        proto.weekday = getSetLocaleDayOfWeek;
        proto.isoWeekday = getSetISODayOfWeek;
        proto.dayOfYear = getSetDayOfYear;
        proto.hour = proto.hours = getSetHour;
        proto.minute = proto.minutes = getSetMinute;
        proto.second = proto.seconds = getSetSecond;
        proto.millisecond = proto.milliseconds = getSetMillisecond;
        proto.utcOffset = getSetOffset;
        proto.utc = setOffsetToUTC;
        proto.local = setOffsetToLocal;
        proto.parseZone = setOffsetToParsedOffset;
        proto.hasAlignedHourOffset = hasAlignedHourOffset;
        proto.isDST = isDaylightSavingTime;
        proto.isLocal = isLocal;
        proto.isUtcOffset = isUtcOffset;
        proto.isUtc = isUtc;
        proto.isUTC = isUtc;
        proto.zoneAbbr = getZoneAbbr;
        proto.zoneName = getZoneName;
        proto.dates = deprecate(
            'dates accessor is deprecated. Use date instead.',
            getSetDayOfMonth
        );
        proto.months = deprecate(
            'months accessor is deprecated. Use month instead',
            getSetMonth
        );
        proto.years = deprecate(
            'years accessor is deprecated. Use year instead',
            getSetYear
        );
        proto.zone = deprecate(
            'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
            getSetZone
        );
        proto.isDSTShifted = deprecate(
            'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
            isDaylightSavingTimeShifted
        );

        function createUnix(input) {
            return createLocal(input * 1000);
        }

        function createInZone() {
            return createLocal.apply(null, arguments).parseZone();
        }

        function preParsePostFormat(string) {
            return string;
        }

        var proto$1 = Locale.prototype;

        proto$1.calendar = calendar;
        proto$1.longDateFormat = longDateFormat;
        proto$1.invalidDate = invalidDate;
        proto$1.ordinal = ordinal;
        proto$1.preparse = preParsePostFormat;
        proto$1.postformat = preParsePostFormat;
        proto$1.relativeTime = relativeTime;
        proto$1.pastFuture = pastFuture;
        proto$1.set = set;
        proto$1.eras = localeEras;
        proto$1.erasParse = localeErasParse;
        proto$1.erasConvertYear = localeErasConvertYear;
        proto$1.erasAbbrRegex = erasAbbrRegex;
        proto$1.erasNameRegex = erasNameRegex;
        proto$1.erasNarrowRegex = erasNarrowRegex;

        proto$1.months = localeMonths;
        proto$1.monthsShort = localeMonthsShort;
        proto$1.monthsParse = localeMonthsParse;
        proto$1.monthsRegex = monthsRegex;
        proto$1.monthsShortRegex = monthsShortRegex;
        proto$1.week = localeWeek;
        proto$1.firstDayOfYear = localeFirstDayOfYear;
        proto$1.firstDayOfWeek = localeFirstDayOfWeek;

        proto$1.weekdays = localeWeekdays;
        proto$1.weekdaysMin = localeWeekdaysMin;
        proto$1.weekdaysShort = localeWeekdaysShort;
        proto$1.weekdaysParse = localeWeekdaysParse;

        proto$1.weekdaysRegex = weekdaysRegex;
        proto$1.weekdaysShortRegex = weekdaysShortRegex;
        proto$1.weekdaysMinRegex = weekdaysMinRegex;

        proto$1.isPM = localeIsPM;
        proto$1.meridiem = localeMeridiem;

        function get$1(format, index, field, setter) {
            var locale = getLocale(),
                utc = createUTC().set(setter, index);
            return locale[field](utc, format);
        }

        function listMonthsImpl(format, index, field) {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';

            if (index != null) {
                return get$1(format, index, field, 'month');
            }

            var i,
                out = [];
            for (i = 0; i < 12; i++) {
                out[i] = get$1(format, i, field, 'month');
            }
            return out;
        }

        // ()
        // (5)
        // (fmt, 5)
        // (fmt)
        // (true)
        // (true, 5)
        // (true, fmt, 5)
        // (true, fmt)
        function listWeekdaysImpl(localeSorted, format, index, field) {
            if (typeof localeSorted === 'boolean') {
                if (isNumber(format)) {
                    index = format;
                    format = undefined;
                }

                format = format || '';
            } else {
                format = localeSorted;
                index = format;
                localeSorted = false;

                if (isNumber(format)) {
                    index = format;
                    format = undefined;
                }

                format = format || '';
            }

            var locale = getLocale(),
                shift = localeSorted ? locale._week.dow : 0,
                i,
                out = [];

            if (index != null) {
                return get$1(format, (index + shift) % 7, field, 'day');
            }

            for (i = 0; i < 7; i++) {
                out[i] = get$1(format, (i + shift) % 7, field, 'day');
            }
            return out;
        }

        function listMonths(format, index) {
            return listMonthsImpl(format, index, 'months');
        }

        function listMonthsShort(format, index) {
            return listMonthsImpl(format, index, 'monthsShort');
        }

        function listWeekdays(localeSorted, format, index) {
            return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
        }

        function listWeekdaysShort(localeSorted, format, index) {
            return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
        }

        function listWeekdaysMin(localeSorted, format, index) {
            return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
        }

        getSetGlobalLocale('en', {
            eras: [
                {
                    since: '0001-01-01',
                    until: +Infinity,
                    offset: 1,
                    name: 'Anno Domini',
                    narrow: 'AD',
                    abbr: 'AD',
                },
                {
                    since: '0000-12-31',
                    until: -Infinity,
                    offset: 1,
                    name: 'Before Christ',
                    narrow: 'BC',
                    abbr: 'BC',
                },
            ],
            dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
            ordinal: function (number) {
                var b = number % 10,
                    output =
                        toInt((number % 100) / 10) === 1
                            ? 'th'
                            : b === 1
                            ? 'st'
                            : b === 2
                            ? 'nd'
                            : b === 3
                            ? 'rd'
                            : 'th';
                return number + output;
            },
        });

        // Side effect imports

        hooks.lang = deprecate(
            'moment.lang is deprecated. Use moment.locale instead.',
            getSetGlobalLocale
        );
        hooks.langData = deprecate(
            'moment.langData is deprecated. Use moment.localeData instead.',
            getLocale
        );

        var mathAbs = Math.abs;

        function abs() {
            var data = this._data;

            this._milliseconds = mathAbs(this._milliseconds);
            this._days = mathAbs(this._days);
            this._months = mathAbs(this._months);

            data.milliseconds = mathAbs(data.milliseconds);
            data.seconds = mathAbs(data.seconds);
            data.minutes = mathAbs(data.minutes);
            data.hours = mathAbs(data.hours);
            data.months = mathAbs(data.months);
            data.years = mathAbs(data.years);

            return this;
        }

        function addSubtract$1(duration, input, value, direction) {
            var other = createDuration(input, value);

            duration._milliseconds += direction * other._milliseconds;
            duration._days += direction * other._days;
            duration._months += direction * other._months;

            return duration._bubble();
        }

        // supports only 2.0-style add(1, 's') or add(duration)
        function add$1(input, value) {
            return addSubtract$1(this, input, value, 1);
        }

        // supports only 2.0-style subtract(1, 's') or subtract(duration)
        function subtract$1(input, value) {
            return addSubtract$1(this, input, value, -1);
        }

        function absCeil(number) {
            if (number < 0) {
                return Math.floor(number);
            } else {
                return Math.ceil(number);
            }
        }

        function bubble() {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds,
                minutes,
                hours,
                years,
                monthsFromDays;

            // if we have a mix of positive and negative values, bubble down first
            // check: https://github.com/moment/moment/issues/2166
            if (
                !(
                    (milliseconds >= 0 && days >= 0 && months >= 0) ||
                    (milliseconds <= 0 && days <= 0 && months <= 0)
                )
            ) {
                milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
                days = 0;
                months = 0;
            }

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absFloor(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absFloor(seconds / 60);
            data.minutes = minutes % 60;

            hours = absFloor(minutes / 60);
            data.hours = hours % 24;

            days += absFloor(hours / 24);

            // convert days to months
            monthsFromDays = absFloor(daysToMonths(days));
            months += monthsFromDays;
            days -= absCeil(monthsToDays(monthsFromDays));

            // 12 months -> 1 year
            years = absFloor(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;

            return this;
        }

        function daysToMonths(days) {
            // 400 years have 146097 days (taking into account leap year rules)
            // 400 years have 12 months === 4800
            return (days * 4800) / 146097;
        }

        function monthsToDays(months) {
            // the reverse of daysToMonths
            return (months * 146097) / 4800;
        }

        function as(units) {
            if (!this.isValid()) {
                return NaN;
            }
            var days,
                months,
                milliseconds = this._milliseconds;

            units = normalizeUnits(units);

            if (units === 'month' || units === 'quarter' || units === 'year') {
                days = this._days + milliseconds / 864e5;
                months = this._months + daysToMonths(days);
                switch (units) {
                    case 'month':
                        return months;
                    case 'quarter':
                        return months / 3;
                    case 'year':
                        return months / 12;
                }
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(monthsToDays(this._months));
                switch (units) {
                    case 'week':
                        return days / 7 + milliseconds / 6048e5;
                    case 'day':
                        return days + milliseconds / 864e5;
                    case 'hour':
                        return days * 24 + milliseconds / 36e5;
                    case 'minute':
                        return days * 1440 + milliseconds / 6e4;
                    case 'second':
                        return days * 86400 + milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond':
                        return Math.floor(days * 864e5) + milliseconds;
                    default:
                        throw new Error('Unknown unit ' + units);
                }
            }
        }

        // TODO: Use this.as('ms')?
        function valueOf$1() {
            if (!this.isValid()) {
                return NaN;
            }
            return (
                this._milliseconds +
                this._days * 864e5 +
                (this._months % 12) * 2592e6 +
                toInt(this._months / 12) * 31536e6
            );
        }

        function makeAs(alias) {
            return function () {
                return this.as(alias);
            };
        }

        var asMilliseconds = makeAs('ms'),
            asSeconds = makeAs('s'),
            asMinutes = makeAs('m'),
            asHours = makeAs('h'),
            asDays = makeAs('d'),
            asWeeks = makeAs('w'),
            asMonths = makeAs('M'),
            asQuarters = makeAs('Q'),
            asYears = makeAs('y');

        function clone$1() {
            return createDuration(this);
        }

        function get$2(units) {
            units = normalizeUnits(units);
            return this.isValid() ? this[units + 's']() : NaN;
        }

        function makeGetter(name) {
            return function () {
                return this.isValid() ? this._data[name] : NaN;
            };
        }

        var milliseconds = makeGetter('milliseconds'),
            seconds = makeGetter('seconds'),
            minutes = makeGetter('minutes'),
            hours = makeGetter('hours'),
            days = makeGetter('days'),
            months = makeGetter('months'),
            years = makeGetter('years');

        function weeks() {
            return absFloor(this.days() / 7);
        }

        var round = Math.round,
            thresholds = {
                ss: 44, // a few seconds to seconds
                s: 45, // seconds to minute
                m: 45, // minutes to hour
                h: 22, // hours to day
                d: 26, // days to month/week
                w: null, // weeks to month
                M: 11, // months to year
            };

        // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
        function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
            return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
        }

        function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
            var duration = createDuration(posNegDuration).abs(),
                seconds = round(duration.as('s')),
                minutes = round(duration.as('m')),
                hours = round(duration.as('h')),
                days = round(duration.as('d')),
                months = round(duration.as('M')),
                weeks = round(duration.as('w')),
                years = round(duration.as('y')),
                a =
                    (seconds <= thresholds.ss && ['s', seconds]) ||
                    (seconds < thresholds.s && ['ss', seconds]) ||
                    (minutes <= 1 && ['m']) ||
                    (minutes < thresholds.m && ['mm', minutes]) ||
                    (hours <= 1 && ['h']) ||
                    (hours < thresholds.h && ['hh', hours]) ||
                    (days <= 1 && ['d']) ||
                    (days < thresholds.d && ['dd', days]);

            if (thresholds.w != null) {
                a =
                    a ||
                    (weeks <= 1 && ['w']) ||
                    (weeks < thresholds.w && ['ww', weeks]);
            }
            a = a ||
                (months <= 1 && ['M']) ||
                (months < thresholds.M && ['MM', months]) ||
                (years <= 1 && ['y']) || ['yy', years];

            a[2] = withoutSuffix;
            a[3] = +posNegDuration > 0;
            a[4] = locale;
            return substituteTimeAgo.apply(null, a);
        }

        // This function allows you to set the rounding function for relative time strings
        function getSetRelativeTimeRounding(roundingFunction) {
            if (roundingFunction === undefined) {
                return round;
            }
            if (typeof roundingFunction === 'function') {
                round = roundingFunction;
                return true;
            }
            return false;
        }

        // This function allows you to set a threshold for relative time strings
        function getSetRelativeTimeThreshold(threshold, limit) {
            if (thresholds[threshold] === undefined) {
                return false;
            }
            if (limit === undefined) {
                return thresholds[threshold];
            }
            thresholds[threshold] = limit;
            if (threshold === 's') {
                thresholds.ss = limit - 1;
            }
            return true;
        }

        function humanize(argWithSuffix, argThresholds) {
            if (!this.isValid()) {
                return this.localeData().invalidDate();
            }

            var withSuffix = false,
                th = thresholds,
                locale,
                output;

            if (typeof argWithSuffix === 'object') {
                argThresholds = argWithSuffix;
                argWithSuffix = false;
            }
            if (typeof argWithSuffix === 'boolean') {
                withSuffix = argWithSuffix;
            }
            if (typeof argThresholds === 'object') {
                th = Object.assign({}, thresholds, argThresholds);
                if (argThresholds.s != null && argThresholds.ss == null) {
                    th.ss = argThresholds.s - 1;
                }
            }

            locale = this.localeData();
            output = relativeTime$1(this, !withSuffix, th, locale);

            if (withSuffix) {
                output = locale.pastFuture(+this, output);
            }

            return locale.postformat(output);
        }

        var abs$1 = Math.abs;

        function sign(x) {
            return (x > 0) - (x < 0) || +x;
        }

        function toISOString$1() {
            // for ISO strings we do not use the normal bubbling rules:
            //  * milliseconds bubble up until they become hours
            //  * days do not bubble at all
            //  * months bubble up until they become years
            // This is because there is no context-free conversion between hours and days
            // (think of clock changes)
            // and also not between days and months (28-31 days per month)
            if (!this.isValid()) {
                return this.localeData().invalidDate();
            }

            var seconds = abs$1(this._milliseconds) / 1000,
                days = abs$1(this._days),
                months = abs$1(this._months),
                minutes,
                hours,
                years,
                s,
                total = this.asSeconds(),
                totalSign,
                ymSign,
                daysSign,
                hmsSign;

            if (!total) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            // 3600 seconds -> 60 minutes -> 1 hour
            minutes = absFloor(seconds / 60);
            hours = absFloor(minutes / 60);
            seconds %= 60;
            minutes %= 60;

            // 12 months -> 1 year
            years = absFloor(months / 12);
            months %= 12;

            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

            totalSign = total < 0 ? '-' : '';
            ymSign = sign(this._months) !== sign(total) ? '-' : '';
            daysSign = sign(this._days) !== sign(total) ? '-' : '';
            hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

            return (
                totalSign +
                'P' +
                (years ? ymSign + years + 'Y' : '') +
                (months ? ymSign + months + 'M' : '') +
                (days ? daysSign + days + 'D' : '') +
                (hours || minutes || seconds ? 'T' : '') +
                (hours ? hmsSign + hours + 'H' : '') +
                (minutes ? hmsSign + minutes + 'M' : '') +
                (seconds ? hmsSign + s + 'S' : '')
            );
        }

        var proto$2 = Duration.prototype;

        proto$2.isValid = isValid$1;
        proto$2.abs = abs;
        proto$2.add = add$1;
        proto$2.subtract = subtract$1;
        proto$2.as = as;
        proto$2.asMilliseconds = asMilliseconds;
        proto$2.asSeconds = asSeconds;
        proto$2.asMinutes = asMinutes;
        proto$2.asHours = asHours;
        proto$2.asDays = asDays;
        proto$2.asWeeks = asWeeks;
        proto$2.asMonths = asMonths;
        proto$2.asQuarters = asQuarters;
        proto$2.asYears = asYears;
        proto$2.valueOf = valueOf$1;
        proto$2._bubble = bubble;
        proto$2.clone = clone$1;
        proto$2.get = get$2;
        proto$2.milliseconds = milliseconds;
        proto$2.seconds = seconds;
        proto$2.minutes = minutes;
        proto$2.hours = hours;
        proto$2.days = days;
        proto$2.weeks = weeks;
        proto$2.months = months;
        proto$2.years = years;
        proto$2.humanize = humanize;
        proto$2.toISOString = toISOString$1;
        proto$2.toString = toISOString$1;
        proto$2.toJSON = toISOString$1;
        proto$2.locale = locale;
        proto$2.localeData = localeData;

        proto$2.toIsoString = deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
            toISOString$1
        );
        proto$2.lang = lang;

        // FORMATTING

        addFormatToken('X', 0, 0, 'unix');
        addFormatToken('x', 0, 0, 'valueOf');

        // PARSING

        addRegexToken('x', matchSigned);
        addRegexToken('X', matchTimestamp);
        addParseToken('X', function (input, array, config) {
            config._d = new Date(parseFloat(input) * 1000);
        });
        addParseToken('x', function (input, array, config) {
            config._d = new Date(toInt(input));
        });

        //! moment.js

        hooks.version = '2.29.3';

        setHookCallback(createLocal);

        hooks.fn = proto;
        hooks.min = min;
        hooks.max = max;
        hooks.now = now;
        hooks.utc = createUTC;
        hooks.unix = createUnix;
        hooks.months = listMonths;
        hooks.isDate = isDate;
        hooks.locale = getSetGlobalLocale;
        hooks.invalid = createInvalid;
        hooks.duration = createDuration;
        hooks.isMoment = isMoment;
        hooks.weekdays = listWeekdays;
        hooks.parseZone = createInZone;
        hooks.localeData = getLocale;
        hooks.isDuration = isDuration;
        hooks.monthsShort = listMonthsShort;
        hooks.weekdaysMin = listWeekdaysMin;
        hooks.defineLocale = defineLocale;
        hooks.updateLocale = updateLocale;
        hooks.locales = listLocales;
        hooks.weekdaysShort = listWeekdaysShort;
        hooks.normalizeUnits = normalizeUnits;
        hooks.relativeTimeRounding = getSetRelativeTimeRounding;
        hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
        hooks.calendarFormat = getCalendarFormat;
        hooks.prototype = proto;

        // currently HTML5 input type only supports 24-hour formats
        hooks.HTML5_FMT = {
            DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
            DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
            DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
            DATE: 'YYYY-MM-DD', // <input type="date" />
            TIME: 'HH:mm', // <input type="time" />
            TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
            TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
            WEEK: 'GGGG-[W]WW', // <input type="week" />
            MONTH: 'YYYY-MM', // <input type="month" />
        };

        return hooks;

    })));
    });

    /* src\pages\Home\Home.svelte generated by Svelte v3.47.0 */
    const file$8 = "src\\pages\\Home\\Home.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (97:0) {#if mounted}
    function create_if_block$3(ctx) {
    	let div3;
    	let div1;
    	let button0;
    	let t1;
    	let div0;
    	let input;
    	let t2;
    	let textarea;
    	let t3;
    	let button1;
    	let t5;
    	let t6;
    	let div2;
    	let studentcard;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$posts*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	studentcard = new StudentCard({
    			props: {
    				firstName: /*$studentData*/ ctx[1].firstName,
    				lastName: /*$studentData*/ ctx[1].lastName,
    				studentNumber: /*$studentData*/ ctx[1].studentNumber,
    				className: /*$studentData*/ ctx[1].className,
    				email: /*$studentData*/ ctx[1].email,
    				phone: /*$studentData*/ ctx[1].phone,
    				address: /*$studentData*/ ctx[1].address,
    				showGrades: true,
    				dansk: /*$studentData*/ ctx[1].dansk,
    				engelsk: /*$studentData*/ ctx[1].engelsk,
    				historie: /*$studentData*/ ctx[1].historie,
    				matematik: /*$studentData*/ ctx[1].matematik,
    				geografi: /*$studentData*/ ctx[1].geografi,
    				small: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = "Opret opslag";
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			textarea = element("textarea");
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Slå op";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div2 = element("div");
    			create_component(studentcard.$$.fragment);
    			attr_dev(button0, "id", "open-form-btn");
    			attr_dev(button0, "class", "svelte-1nf0uii");
    			add_location(button0, file$8, 99, 4, 2795);
    			attr_dev(input, "id", "title-input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Titel");
    			attr_dev(input, "class", "svelte-1nf0uii");
    			add_location(input, file$8, 101, 6, 2920);
    			attr_dev(textarea, "type", "text");
    			attr_dev(textarea, "id", "content-input");
    			attr_dev(textarea, "cols", "40");
    			attr_dev(textarea, "rows", "8");
    			attr_dev(textarea, "placeholder", "Besked");
    			attr_dev(textarea, "class", "svelte-1nf0uii");
    			add_location(textarea, file$8, 102, 6, 2986);
    			attr_dev(button1, "id", "send-post-btn");
    			attr_dev(button1, "class", "svelte-1nf0uii");
    			add_location(button1, file$8, 110, 6, 3131);
    			attr_dev(div0, "id", "create-post");
    			attr_dev(div0, "class", "hidden svelte-1nf0uii");
    			add_location(div0, file$8, 100, 4, 2875);
    			attr_dev(div1, "class", "posts");
    			add_location(div1, file$8, 98, 2, 2770);
    			attr_dev(div2, "class", "student-info");
    			add_location(div2, file$8, 122, 2, 3425);
    			attr_dev(div3, "class", "container svelte-1nf0uii");
    			add_location(div3, file$8, 97, 0, 2743);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div1);
    			append_dev(div1, button0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			append_dev(div0, t2);
    			append_dev(div0, textarea);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(div1, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			mount_component(studentcard, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", handleFormOpen, false, false, false),
    					listen_dev(button1, "click", /*handleSendPost*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$posts*/ 4) {
    				each_value = /*$posts*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const studentcard_changes = {};
    			if (dirty & /*$studentData*/ 2) studentcard_changes.firstName = /*$studentData*/ ctx[1].firstName;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.lastName = /*$studentData*/ ctx[1].lastName;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.studentNumber = /*$studentData*/ ctx[1].studentNumber;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.className = /*$studentData*/ ctx[1].className;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.email = /*$studentData*/ ctx[1].email;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.phone = /*$studentData*/ ctx[1].phone;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.address = /*$studentData*/ ctx[1].address;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.dansk = /*$studentData*/ ctx[1].dansk;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.engelsk = /*$studentData*/ ctx[1].engelsk;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.historie = /*$studentData*/ ctx[1].historie;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.matematik = /*$studentData*/ ctx[1].matematik;
    			if (dirty & /*$studentData*/ 2) studentcard_changes.geografi = /*$studentData*/ ctx[1].geografi;
    			studentcard.$set(studentcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(studentcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(studentcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks, detaching);
    			destroy_component(studentcard);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(97:0) {#if mounted}",
    		ctx
    	});

    	return block;
    }

    // (114:4) {#each $posts as post}
    function create_each_block$1(ctx) {
    	let post;
    	let current;

    	post = new Post({
    			props: {
    				title: /*post*/ ctx[7].title,
    				content: /*post*/ ctx[7].content,
    				creator: /*post*/ ctx[7].studentName,
    				timestamp: /*post*/ ctx[7].created
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(post.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(post, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const post_changes = {};
    			if (dirty & /*$posts*/ 4) post_changes.title = /*post*/ ctx[7].title;
    			if (dirty & /*$posts*/ 4) post_changes.content = /*post*/ ctx[7].content;
    			if (dirty & /*$posts*/ 4) post_changes.creator = /*post*/ ctx[7].studentName;
    			if (dirty & /*$posts*/ 4) post_changes.timestamp = /*post*/ ctx[7].created;
    			post.$set(post_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(post.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(post.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(post, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(114:4) {#each $posts as post}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*mounted*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*mounted*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*mounted*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleFormOpen() {
    	const form = document.getElementById("create-post");
    	form.classList.toggle("hidden");
    	form.classList.toggle("show");
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $studentData;
    	let $userId;
    	let $posts;
    	validate_store(studentData, 'studentData');
    	component_subscribe($$self, studentData, $$value => $$invalidate(1, $studentData = $$value));
    	validate_store(userId, 'userId');
    	component_subscribe($$self, userId, $$value => $$invalidate(4, $userId = $$value));
    	validate_store(posts, 'posts');
    	component_subscribe($$self, posts, $$value => $$invalidate(2, $posts = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let mounted = false;

    	onMount(async () => {
    		await getStudentData();
    		await getPosts();
    		$$invalidate(0, mounted = true);
    	});

    	//Get student data
    	async function getStudentData() {
    		const response = await fetch("http://localhost:3000/api/students/" + $userId);
    		const data = await response.json();
    		studentData.set(data.data);
    	}

    	//Get posts for the students class
    	async function getPosts() {
    		const response = await fetch("http://localhost:3000/api/posts/" + $studentData.classId);
    		const data = await response.json();
    		posts.set(data.data);
    	}

    	async function handleSendPost() {
    		const title = document.getElementById("title-input");
    		const content = document.getElementById("content-input");
    		const created = moment().format("YYYY-MM-DD HH:mm:ss");
    		const studentName = $studentData.firstName + " " + $studentData.lastName;
    		const classId = $studentData.classId;

    		if (title.value === "" || content.value === "") {
    			toasts.error("Udfyld venligst både titel og indhold");
    			return;
    		}

    		const post = {
    			title: title.value,
    			content: content.value,
    			created,
    			studentName,
    			classId
    		};

    		try {
    			await fetch("http://localhost:3000/api/posts", {
    				method: "POST",
    				body: JSON.stringify(post),
    				headers: {
    					"Content-type": "application/json; charset=UTF-8"
    				}
    			}).then(response => response.json()).then(responseText => {
    				if (responseText.success) {
    					toasts.success("Dit opslag er nu oprettet");
    					getPosts();
    					title.value = "";
    					content.value = "";
    				} else {
    					toasts.error("Der skete en fejl");
    				}
    			});
    		} catch(e) {
    			toasts.error("Der skete en fejl");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		userId,
    		studentData,
    		posts,
    		Post,
    		StudentCard,
    		onMount,
    		moment,
    		toasts,
    		mounted,
    		getStudentData,
    		getPosts,
    		handleFormOpen,
    		handleSendPost,
    		$studentData,
    		$userId,
    		$posts
    	});

    	$$self.$inject_state = $$props => {
    		if ('mounted' in $$props) $$invalidate(0, mounted = $$props.mounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mounted, $studentData, $posts, handleSendPost];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\pages\Students\Students.svelte generated by Svelte v3.47.0 */
    const file$7 = "src\\pages\\Students\\Students.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (15:4) {#each $students as student}
    function create_each_block(ctx) {
    	let studentcard;
    	let current;

    	studentcard = new StudentCard({
    			props: {
    				firstName: /*student*/ ctx[2].firstName,
    				lastName: /*student*/ ctx[2].lastName,
    				studentNumber: /*student*/ ctx[2].studentNumber,
    				className: /*student*/ ctx[2].className,
    				email: /*student*/ ctx[2].email,
    				phone: /*student*/ ctx[2].phone,
    				address: /*student*/ ctx[2].address,
    				showGrades: false,
    				small: true
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(studentcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(studentcard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const studentcard_changes = {};
    			if (dirty & /*$students*/ 1) studentcard_changes.firstName = /*student*/ ctx[2].firstName;
    			if (dirty & /*$students*/ 1) studentcard_changes.lastName = /*student*/ ctx[2].lastName;
    			if (dirty & /*$students*/ 1) studentcard_changes.studentNumber = /*student*/ ctx[2].studentNumber;
    			if (dirty & /*$students*/ 1) studentcard_changes.className = /*student*/ ctx[2].className;
    			if (dirty & /*$students*/ 1) studentcard_changes.email = /*student*/ ctx[2].email;
    			if (dirty & /*$students*/ 1) studentcard_changes.phone = /*student*/ ctx[2].phone;
    			if (dirty & /*$students*/ 1) studentcard_changes.address = /*student*/ ctx[2].address;
    			studentcard.$set(studentcard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(studentcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(studentcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(studentcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:4) {#each $students as student}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let current;
    	let each_value = /*$students*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "container svelte-1o9ecgv");
    			add_location(div, file$7, 13, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$students*/ 1) {
    				each_value = /*$students*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $students;
    	validate_store(students, 'students');
    	component_subscribe($$self, students, $$value => $$invalidate(0, $students = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Students', slots, []);

    	async function getAllStudents() {
    		const response = await fetch("http://localhost:3000/api/students/");
    		const data = await response.json();
    		students.set(data.data);
    	}

    	getAllStudents();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Students> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		students,
    		StudentCard,
    		getAllStudents,
    		$students
    	});

    	return [$students];
    }

    class Students extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Students",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /*!
     * Chart.js v3.7.1
     * https://www.chartjs.org
     * (c) 2022 Chart.js Contributors
     * Released under the MIT License
     */
    const requestAnimFrame = (function() {
      if (typeof window === 'undefined') {
        return function(callback) {
          return callback();
        };
      }
      return window.requestAnimationFrame;
    }());
    function throttled(fn, thisArg, updateFn) {
      const updateArgs = updateFn || ((args) => Array.prototype.slice.call(args));
      let ticking = false;
      let args = [];
      return function(...rest) {
        args = updateArgs(rest);
        if (!ticking) {
          ticking = true;
          requestAnimFrame.call(window, () => {
            ticking = false;
            fn.apply(thisArg, args);
          });
        }
      };
    }
    function debounce(fn, delay) {
      let timeout;
      return function(...args) {
        if (delay) {
          clearTimeout(timeout);
          timeout = setTimeout(fn, delay, args);
        } else {
          fn.apply(this, args);
        }
        return delay;
      };
    }
    const _toLeftRightCenter = (align) => align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';
    const _alignStartEnd = (align, start, end) => align === 'start' ? start : align === 'end' ? end : (start + end) / 2;
    const _textX = (align, left, right, rtl) => {
      const check = rtl ? 'left' : 'right';
      return align === check ? right : align === 'center' ? (left + right) / 2 : left;
    };

    function noop() {}
    const uid = (function() {
      let id = 0;
      return function() {
        return id++;
      };
    }());
    function isNullOrUndef(value) {
      return value === null || typeof value === 'undefined';
    }
    function isArray(value) {
      if (Array.isArray && Array.isArray(value)) {
        return true;
      }
      const type = Object.prototype.toString.call(value);
      if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
        return true;
      }
      return false;
    }
    function isObject(value) {
      return value !== null && Object.prototype.toString.call(value) === '[object Object]';
    }
    const isNumberFinite = (value) => (typeof value === 'number' || value instanceof Number) && isFinite(+value);
    function finiteOrDefault(value, defaultValue) {
      return isNumberFinite(value) ? value : defaultValue;
    }
    function valueOrDefault(value, defaultValue) {
      return typeof value === 'undefined' ? defaultValue : value;
    }
    const toPercentage = (value, dimension) =>
      typeof value === 'string' && value.endsWith('%') ?
        parseFloat(value) / 100
        : value / dimension;
    const toDimension = (value, dimension) =>
      typeof value === 'string' && value.endsWith('%') ?
        parseFloat(value) / 100 * dimension
        : +value;
    function callback(fn, args, thisArg) {
      if (fn && typeof fn.call === 'function') {
        return fn.apply(thisArg, args);
      }
    }
    function each(loopable, fn, thisArg, reverse) {
      let i, len, keys;
      if (isArray(loopable)) {
        len = loopable.length;
        if (reverse) {
          for (i = len - 1; i >= 0; i--) {
            fn.call(thisArg, loopable[i], i);
          }
        } else {
          for (i = 0; i < len; i++) {
            fn.call(thisArg, loopable[i], i);
          }
        }
      } else if (isObject(loopable)) {
        keys = Object.keys(loopable);
        len = keys.length;
        for (i = 0; i < len; i++) {
          fn.call(thisArg, loopable[keys[i]], keys[i]);
        }
      }
    }
    function _elementsEqual(a0, a1) {
      let i, ilen, v0, v1;
      if (!a0 || !a1 || a0.length !== a1.length) {
        return false;
      }
      for (i = 0, ilen = a0.length; i < ilen; ++i) {
        v0 = a0[i];
        v1 = a1[i];
        if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
          return false;
        }
      }
      return true;
    }
    function clone$1(source) {
      if (isArray(source)) {
        return source.map(clone$1);
      }
      if (isObject(source)) {
        const target = Object.create(null);
        const keys = Object.keys(source);
        const klen = keys.length;
        let k = 0;
        for (; k < klen; ++k) {
          target[keys[k]] = clone$1(source[keys[k]]);
        }
        return target;
      }
      return source;
    }
    function isValidKey(key) {
      return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1;
    }
    function _merger(key, target, source, options) {
      if (!isValidKey(key)) {
        return;
      }
      const tval = target[key];
      const sval = source[key];
      if (isObject(tval) && isObject(sval)) {
        merge(tval, sval, options);
      } else {
        target[key] = clone$1(sval);
      }
    }
    function merge(target, source, options) {
      const sources = isArray(source) ? source : [source];
      const ilen = sources.length;
      if (!isObject(target)) {
        return target;
      }
      options = options || {};
      const merger = options.merger || _merger;
      for (let i = 0; i < ilen; ++i) {
        source = sources[i];
        if (!isObject(source)) {
          continue;
        }
        const keys = Object.keys(source);
        for (let k = 0, klen = keys.length; k < klen; ++k) {
          merger(keys[k], target, source, options);
        }
      }
      return target;
    }
    function mergeIf(target, source) {
      return merge(target, source, {merger: _mergerIf});
    }
    function _mergerIf(key, target, source) {
      if (!isValidKey(key)) {
        return;
      }
      const tval = target[key];
      const sval = source[key];
      if (isObject(tval) && isObject(sval)) {
        mergeIf(tval, sval);
      } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
        target[key] = clone$1(sval);
      }
    }
    const emptyString = '';
    const dot = '.';
    function indexOfDotOrLength(key, start) {
      const idx = key.indexOf(dot, start);
      return idx === -1 ? key.length : idx;
    }
    function resolveObjectKey(obj, key) {
      if (key === emptyString) {
        return obj;
      }
      let pos = 0;
      let idx = indexOfDotOrLength(key, pos);
      while (obj && idx > pos) {
        obj = obj[key.substr(pos, idx - pos)];
        pos = idx + 1;
        idx = indexOfDotOrLength(key, pos);
      }
      return obj;
    }
    function _capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const defined = (value) => typeof value !== 'undefined';
    const isFunction = (value) => typeof value === 'function';
    const setsEqual = (a, b) => {
      if (a.size !== b.size) {
        return false;
      }
      for (const item of a) {
        if (!b.has(item)) {
          return false;
        }
      }
      return true;
    };
    function _isClickEvent(e) {
      return e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu';
    }

    const PI = Math.PI;
    const TAU = 2 * PI;
    const PITAU = TAU + PI;
    const INFINITY = Number.POSITIVE_INFINITY;
    const RAD_PER_DEG = PI / 180;
    const HALF_PI = PI / 2;
    const QUARTER_PI = PI / 4;
    const TWO_THIRDS_PI = PI * 2 / 3;
    const log10 = Math.log10;
    const sign = Math.sign;
    function niceNum(range) {
      const roundedRange = Math.round(range);
      range = almostEquals(range, roundedRange, range / 1000) ? roundedRange : range;
      const niceRange = Math.pow(10, Math.floor(log10(range)));
      const fraction = range / niceRange;
      const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
      return niceFraction * niceRange;
    }
    function _factorize(value) {
      const result = [];
      const sqrt = Math.sqrt(value);
      let i;
      for (i = 1; i < sqrt; i++) {
        if (value % i === 0) {
          result.push(i);
          result.push(value / i);
        }
      }
      if (sqrt === (sqrt | 0)) {
        result.push(sqrt);
      }
      result.sort((a, b) => a - b).pop();
      return result;
    }
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function almostEquals(x, y, epsilon) {
      return Math.abs(x - y) < epsilon;
    }
    function almostWhole(x, epsilon) {
      const rounded = Math.round(x);
      return ((rounded - epsilon) <= x) && ((rounded + epsilon) >= x);
    }
    function _setMinAndMaxByKey(array, target, property) {
      let i, ilen, value;
      for (i = 0, ilen = array.length; i < ilen; i++) {
        value = array[i][property];
        if (!isNaN(value)) {
          target.min = Math.min(target.min, value);
          target.max = Math.max(target.max, value);
        }
      }
    }
    function toRadians(degrees) {
      return degrees * (PI / 180);
    }
    function toDegrees(radians) {
      return radians * (180 / PI);
    }
    function _decimalPlaces(x) {
      if (!isNumberFinite(x)) {
        return;
      }
      let e = 1;
      let p = 0;
      while (Math.round(x * e) / e !== x) {
        e *= 10;
        p++;
      }
      return p;
    }
    function getAngleFromPoint(centrePoint, anglePoint) {
      const distanceFromXCenter = anglePoint.x - centrePoint.x;
      const distanceFromYCenter = anglePoint.y - centrePoint.y;
      const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
      let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);
      if (angle < (-0.5 * PI)) {
        angle += TAU;
      }
      return {
        angle,
        distance: radialDistanceFromCenter
      };
    }
    function distanceBetweenPoints(pt1, pt2) {
      return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
    }
    function _angleDiff(a, b) {
      return (a - b + PITAU) % TAU - PI;
    }
    function _normalizeAngle(a) {
      return (a % TAU + TAU) % TAU;
    }
    function _angleBetween(angle, start, end, sameAngleIsFullCircle) {
      const a = _normalizeAngle(angle);
      const s = _normalizeAngle(start);
      const e = _normalizeAngle(end);
      const angleToStart = _normalizeAngle(s - a);
      const angleToEnd = _normalizeAngle(e - a);
      const startToAngle = _normalizeAngle(a - s);
      const endToAngle = _normalizeAngle(a - e);
      return a === s || a === e || (sameAngleIsFullCircle && s === e)
        || (angleToStart > angleToEnd && startToAngle < endToAngle);
    }
    function _limitValue(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
    function _int16Range(value) {
      return _limitValue(value, -32768, 32767);
    }
    function _isBetween(value, start, end, epsilon = 1e-6) {
      return value >= Math.min(start, end) - epsilon && value <= Math.max(start, end) + epsilon;
    }

    const atEdge = (t) => t === 0 || t === 1;
    const elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));
    const elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;
    const effects = {
      linear: t => t,
      easeInQuad: t => t * t,
      easeOutQuad: t => -t * (t - 2),
      easeInOutQuad: t => ((t /= 0.5) < 1)
        ? 0.5 * t * t
        : -0.5 * ((--t) * (t - 2) - 1),
      easeInCubic: t => t * t * t,
      easeOutCubic: t => (t -= 1) * t * t + 1,
      easeInOutCubic: t => ((t /= 0.5) < 1)
        ? 0.5 * t * t * t
        : 0.5 * ((t -= 2) * t * t + 2),
      easeInQuart: t => t * t * t * t,
      easeOutQuart: t => -((t -= 1) * t * t * t - 1),
      easeInOutQuart: t => ((t /= 0.5) < 1)
        ? 0.5 * t * t * t * t
        : -0.5 * ((t -= 2) * t * t * t - 2),
      easeInQuint: t => t * t * t * t * t,
      easeOutQuint: t => (t -= 1) * t * t * t * t + 1,
      easeInOutQuint: t => ((t /= 0.5) < 1)
        ? 0.5 * t * t * t * t * t
        : 0.5 * ((t -= 2) * t * t * t * t + 2),
      easeInSine: t => -Math.cos(t * HALF_PI) + 1,
      easeOutSine: t => Math.sin(t * HALF_PI),
      easeInOutSine: t => -0.5 * (Math.cos(PI * t) - 1),
      easeInExpo: t => (t === 0) ? 0 : Math.pow(2, 10 * (t - 1)),
      easeOutExpo: t => (t === 1) ? 1 : -Math.pow(2, -10 * t) + 1,
      easeInOutExpo: t => atEdge(t) ? t : t < 0.5
        ? 0.5 * Math.pow(2, 10 * (t * 2 - 1))
        : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
      easeInCirc: t => (t >= 1) ? t : -(Math.sqrt(1 - t * t) - 1),
      easeOutCirc: t => Math.sqrt(1 - (t -= 1) * t),
      easeInOutCirc: t => ((t /= 0.5) < 1)
        ? -0.5 * (Math.sqrt(1 - t * t) - 1)
        : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
      easeInElastic: t => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
      easeOutElastic: t => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),
      easeInOutElastic(t) {
        const s = 0.1125;
        const p = 0.45;
        return atEdge(t) ? t :
          t < 0.5
            ? 0.5 * elasticIn(t * 2, s, p)
            : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
      },
      easeInBack(t) {
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
      },
      easeOutBack(t) {
        const s = 1.70158;
        return (t -= 1) * t * ((s + 1) * t + s) + 1;
      },
      easeInOutBack(t) {
        let s = 1.70158;
        if ((t /= 0.5) < 1) {
          return 0.5 * (t * t * (((s *= (1.525)) + 1) * t - s));
        }
        return 0.5 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
      },
      easeInBounce: t => 1 - effects.easeOutBounce(1 - t),
      easeOutBounce(t) {
        const m = 7.5625;
        const d = 2.75;
        if (t < (1 / d)) {
          return m * t * t;
        }
        if (t < (2 / d)) {
          return m * (t -= (1.5 / d)) * t + 0.75;
        }
        if (t < (2.5 / d)) {
          return m * (t -= (2.25 / d)) * t + 0.9375;
        }
        return m * (t -= (2.625 / d)) * t + 0.984375;
      },
      easeInOutBounce: t => (t < 0.5)
        ? effects.easeInBounce(t * 2) * 0.5
        : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5,
    };

    /*!
     * @kurkle/color v0.1.9
     * https://github.com/kurkle/color#readme
     * (c) 2020 Jukka Kurkela
     * Released under the MIT License
     */
    const map$1 = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15};
    const hex = '0123456789ABCDEF';
    const h1 = (b) => hex[b & 0xF];
    const h2 = (b) => hex[(b & 0xF0) >> 4] + hex[b & 0xF];
    const eq = (b) => (((b & 0xF0) >> 4) === (b & 0xF));
    function isShort(v) {
    	return eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
    }
    function hexParse(str) {
    	var len = str.length;
    	var ret;
    	if (str[0] === '#') {
    		if (len === 4 || len === 5) {
    			ret = {
    				r: 255 & map$1[str[1]] * 17,
    				g: 255 & map$1[str[2]] * 17,
    				b: 255 & map$1[str[3]] * 17,
    				a: len === 5 ? map$1[str[4]] * 17 : 255
    			};
    		} else if (len === 7 || len === 9) {
    			ret = {
    				r: map$1[str[1]] << 4 | map$1[str[2]],
    				g: map$1[str[3]] << 4 | map$1[str[4]],
    				b: map$1[str[5]] << 4 | map$1[str[6]],
    				a: len === 9 ? (map$1[str[7]] << 4 | map$1[str[8]]) : 255
    			};
    		}
    	}
    	return ret;
    }
    function hexString(v) {
    	var f = isShort(v) ? h1 : h2;
    	return v
    		? '#' + f(v.r) + f(v.g) + f(v.b) + (v.a < 255 ? f(v.a) : '')
    		: v;
    }
    function round(v) {
    	return v + 0.5 | 0;
    }
    const lim = (v, l, h) => Math.max(Math.min(v, h), l);
    function p2b(v) {
    	return lim(round(v * 2.55), 0, 255);
    }
    function n2b(v) {
    	return lim(round(v * 255), 0, 255);
    }
    function b2n(v) {
    	return lim(round(v / 2.55) / 100, 0, 1);
    }
    function n2p(v) {
    	return lim(round(v * 100), 0, 100);
    }
    const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
    function rgbParse(str) {
    	const m = RGB_RE.exec(str);
    	let a = 255;
    	let r, g, b;
    	if (!m) {
    		return;
    	}
    	if (m[7] !== r) {
    		const v = +m[7];
    		a = 255 & (m[8] ? p2b(v) : v * 255);
    	}
    	r = +m[1];
    	g = +m[3];
    	b = +m[5];
    	r = 255 & (m[2] ? p2b(r) : r);
    	g = 255 & (m[4] ? p2b(g) : g);
    	b = 255 & (m[6] ? p2b(b) : b);
    	return {
    		r: r,
    		g: g,
    		b: b,
    		a: a
    	};
    }
    function rgbString(v) {
    	return v && (
    		v.a < 255
    			? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})`
    			: `rgb(${v.r}, ${v.g}, ${v.b})`
    	);
    }
    const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;
    function hsl2rgbn(h, s, l) {
    	const a = s * Math.min(l, 1 - l);
    	const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    	return [f(0), f(8), f(4)];
    }
    function hsv2rgbn(h, s, v) {
    	const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    	return [f(5), f(3), f(1)];
    }
    function hwb2rgbn(h, w, b) {
    	const rgb = hsl2rgbn(h, 1, 0.5);
    	let i;
    	if (w + b > 1) {
    		i = 1 / (w + b);
    		w *= i;
    		b *= i;
    	}
    	for (i = 0; i < 3; i++) {
    		rgb[i] *= 1 - w - b;
    		rgb[i] += w;
    	}
    	return rgb;
    }
    function rgb2hsl(v) {
    	const range = 255;
    	const r = v.r / range;
    	const g = v.g / range;
    	const b = v.b / range;
    	const max = Math.max(r, g, b);
    	const min = Math.min(r, g, b);
    	const l = (max + min) / 2;
    	let h, s, d;
    	if (max !== min) {
    		d = max - min;
    		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    		h = max === r
    			? ((g - b) / d) + (g < b ? 6 : 0)
    			: max === g
    				? (b - r) / d + 2
    				: (r - g) / d + 4;
    		h = h * 60 + 0.5;
    	}
    	return [h | 0, s || 0, l];
    }
    function calln(f, a, b, c) {
    	return (
    		Array.isArray(a)
    			? f(a[0], a[1], a[2])
    			: f(a, b, c)
    	).map(n2b);
    }
    function hsl2rgb(h, s, l) {
    	return calln(hsl2rgbn, h, s, l);
    }
    function hwb2rgb(h, w, b) {
    	return calln(hwb2rgbn, h, w, b);
    }
    function hsv2rgb(h, s, v) {
    	return calln(hsv2rgbn, h, s, v);
    }
    function hue(h) {
    	return (h % 360 + 360) % 360;
    }
    function hueParse(str) {
    	const m = HUE_RE.exec(str);
    	let a = 255;
    	let v;
    	if (!m) {
    		return;
    	}
    	if (m[5] !== v) {
    		a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
    	}
    	const h = hue(+m[2]);
    	const p1 = +m[3] / 100;
    	const p2 = +m[4] / 100;
    	if (m[1] === 'hwb') {
    		v = hwb2rgb(h, p1, p2);
    	} else if (m[1] === 'hsv') {
    		v = hsv2rgb(h, p1, p2);
    	} else {
    		v = hsl2rgb(h, p1, p2);
    	}
    	return {
    		r: v[0],
    		g: v[1],
    		b: v[2],
    		a: a
    	};
    }
    function rotate(v, deg) {
    	var h = rgb2hsl(v);
    	h[0] = hue(h[0] + deg);
    	h = hsl2rgb(h);
    	v.r = h[0];
    	v.g = h[1];
    	v.b = h[2];
    }
    function hslString(v) {
    	if (!v) {
    		return;
    	}
    	const a = rgb2hsl(v);
    	const h = a[0];
    	const s = n2p(a[1]);
    	const l = n2p(a[2]);
    	return v.a < 255
    		? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})`
    		: `hsl(${h}, ${s}%, ${l}%)`;
    }
    const map$1$1 = {
    	x: 'dark',
    	Z: 'light',
    	Y: 're',
    	X: 'blu',
    	W: 'gr',
    	V: 'medium',
    	U: 'slate',
    	A: 'ee',
    	T: 'ol',
    	S: 'or',
    	B: 'ra',
    	C: 'lateg',
    	D: 'ights',
    	R: 'in',
    	Q: 'turquois',
    	E: 'hi',
    	P: 'ro',
    	O: 'al',
    	N: 'le',
    	M: 'de',
    	L: 'yello',
    	F: 'en',
    	K: 'ch',
    	G: 'arks',
    	H: 'ea',
    	I: 'ightg',
    	J: 'wh'
    };
    const names = {
    	OiceXe: 'f0f8ff',
    	antiquewEte: 'faebd7',
    	aqua: 'ffff',
    	aquamarRe: '7fffd4',
    	azuY: 'f0ffff',
    	beige: 'f5f5dc',
    	bisque: 'ffe4c4',
    	black: '0',
    	blanKedOmond: 'ffebcd',
    	Xe: 'ff',
    	XeviTet: '8a2be2',
    	bPwn: 'a52a2a',
    	burlywood: 'deb887',
    	caMtXe: '5f9ea0',
    	KartYuse: '7fff00',
    	KocTate: 'd2691e',
    	cSO: 'ff7f50',
    	cSnflowerXe: '6495ed',
    	cSnsilk: 'fff8dc',
    	crimson: 'dc143c',
    	cyan: 'ffff',
    	xXe: '8b',
    	xcyan: '8b8b',
    	xgTMnPd: 'b8860b',
    	xWay: 'a9a9a9',
    	xgYF: '6400',
    	xgYy: 'a9a9a9',
    	xkhaki: 'bdb76b',
    	xmagFta: '8b008b',
    	xTivegYF: '556b2f',
    	xSange: 'ff8c00',
    	xScEd: '9932cc',
    	xYd: '8b0000',
    	xsOmon: 'e9967a',
    	xsHgYF: '8fbc8f',
    	xUXe: '483d8b',
    	xUWay: '2f4f4f',
    	xUgYy: '2f4f4f',
    	xQe: 'ced1',
    	xviTet: '9400d3',
    	dAppRk: 'ff1493',
    	dApskyXe: 'bfff',
    	dimWay: '696969',
    	dimgYy: '696969',
    	dodgerXe: '1e90ff',
    	fiYbrick: 'b22222',
    	flSOwEte: 'fffaf0',
    	foYstWAn: '228b22',
    	fuKsia: 'ff00ff',
    	gaRsbSo: 'dcdcdc',
    	ghostwEte: 'f8f8ff',
    	gTd: 'ffd700',
    	gTMnPd: 'daa520',
    	Way: '808080',
    	gYF: '8000',
    	gYFLw: 'adff2f',
    	gYy: '808080',
    	honeyMw: 'f0fff0',
    	hotpRk: 'ff69b4',
    	RdianYd: 'cd5c5c',
    	Rdigo: '4b0082',
    	ivSy: 'fffff0',
    	khaki: 'f0e68c',
    	lavFMr: 'e6e6fa',
    	lavFMrXsh: 'fff0f5',
    	lawngYF: '7cfc00',
    	NmoncEffon: 'fffacd',
    	ZXe: 'add8e6',
    	ZcSO: 'f08080',
    	Zcyan: 'e0ffff',
    	ZgTMnPdLw: 'fafad2',
    	ZWay: 'd3d3d3',
    	ZgYF: '90ee90',
    	ZgYy: 'd3d3d3',
    	ZpRk: 'ffb6c1',
    	ZsOmon: 'ffa07a',
    	ZsHgYF: '20b2aa',
    	ZskyXe: '87cefa',
    	ZUWay: '778899',
    	ZUgYy: '778899',
    	ZstAlXe: 'b0c4de',
    	ZLw: 'ffffe0',
    	lime: 'ff00',
    	limegYF: '32cd32',
    	lRF: 'faf0e6',
    	magFta: 'ff00ff',
    	maPon: '800000',
    	VaquamarRe: '66cdaa',
    	VXe: 'cd',
    	VScEd: 'ba55d3',
    	VpurpN: '9370db',
    	VsHgYF: '3cb371',
    	VUXe: '7b68ee',
    	VsprRggYF: 'fa9a',
    	VQe: '48d1cc',
    	VviTetYd: 'c71585',
    	midnightXe: '191970',
    	mRtcYam: 'f5fffa',
    	mistyPse: 'ffe4e1',
    	moccasR: 'ffe4b5',
    	navajowEte: 'ffdead',
    	navy: '80',
    	Tdlace: 'fdf5e6',
    	Tive: '808000',
    	TivedBb: '6b8e23',
    	Sange: 'ffa500',
    	SangeYd: 'ff4500',
    	ScEd: 'da70d6',
    	pOegTMnPd: 'eee8aa',
    	pOegYF: '98fb98',
    	pOeQe: 'afeeee',
    	pOeviTetYd: 'db7093',
    	papayawEp: 'ffefd5',
    	pHKpuff: 'ffdab9',
    	peru: 'cd853f',
    	pRk: 'ffc0cb',
    	plum: 'dda0dd',
    	powMrXe: 'b0e0e6',
    	purpN: '800080',
    	YbeccapurpN: '663399',
    	Yd: 'ff0000',
    	Psybrown: 'bc8f8f',
    	PyOXe: '4169e1',
    	saddNbPwn: '8b4513',
    	sOmon: 'fa8072',
    	sandybPwn: 'f4a460',
    	sHgYF: '2e8b57',
    	sHshell: 'fff5ee',
    	siFna: 'a0522d',
    	silver: 'c0c0c0',
    	skyXe: '87ceeb',
    	UXe: '6a5acd',
    	UWay: '708090',
    	UgYy: '708090',
    	snow: 'fffafa',
    	sprRggYF: 'ff7f',
    	stAlXe: '4682b4',
    	tan: 'd2b48c',
    	teO: '8080',
    	tEstN: 'd8bfd8',
    	tomato: 'ff6347',
    	Qe: '40e0d0',
    	viTet: 'ee82ee',
    	JHt: 'f5deb3',
    	wEte: 'ffffff',
    	wEtesmoke: 'f5f5f5',
    	Lw: 'ffff00',
    	LwgYF: '9acd32'
    };
    function unpack() {
    	const unpacked = {};
    	const keys = Object.keys(names);
    	const tkeys = Object.keys(map$1$1);
    	let i, j, k, ok, nk;
    	for (i = 0; i < keys.length; i++) {
    		ok = nk = keys[i];
    		for (j = 0; j < tkeys.length; j++) {
    			k = tkeys[j];
    			nk = nk.replace(k, map$1$1[k]);
    		}
    		k = parseInt(names[ok], 16);
    		unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
    	}
    	return unpacked;
    }
    let names$1;
    function nameParse(str) {
    	if (!names$1) {
    		names$1 = unpack();
    		names$1.transparent = [0, 0, 0, 0];
    	}
    	const a = names$1[str.toLowerCase()];
    	return a && {
    		r: a[0],
    		g: a[1],
    		b: a[2],
    		a: a.length === 4 ? a[3] : 255
    	};
    }
    function modHSL(v, i, ratio) {
    	if (v) {
    		let tmp = rgb2hsl(v);
    		tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
    		tmp = hsl2rgb(tmp);
    		v.r = tmp[0];
    		v.g = tmp[1];
    		v.b = tmp[2];
    	}
    }
    function clone(v, proto) {
    	return v ? Object.assign(proto || {}, v) : v;
    }
    function fromObject(input) {
    	var v = {r: 0, g: 0, b: 0, a: 255};
    	if (Array.isArray(input)) {
    		if (input.length >= 3) {
    			v = {r: input[0], g: input[1], b: input[2], a: 255};
    			if (input.length > 3) {
    				v.a = n2b(input[3]);
    			}
    		}
    	} else {
    		v = clone(input, {r: 0, g: 0, b: 0, a: 1});
    		v.a = n2b(v.a);
    	}
    	return v;
    }
    function functionParse(str) {
    	if (str.charAt(0) === 'r') {
    		return rgbParse(str);
    	}
    	return hueParse(str);
    }
    class Color {
    	constructor(input) {
    		if (input instanceof Color) {
    			return input;
    		}
    		const type = typeof input;
    		let v;
    		if (type === 'object') {
    			v = fromObject(input);
    		} else if (type === 'string') {
    			v = hexParse(input) || nameParse(input) || functionParse(input);
    		}
    		this._rgb = v;
    		this._valid = !!v;
    	}
    	get valid() {
    		return this._valid;
    	}
    	get rgb() {
    		var v = clone(this._rgb);
    		if (v) {
    			v.a = b2n(v.a);
    		}
    		return v;
    	}
    	set rgb(obj) {
    		this._rgb = fromObject(obj);
    	}
    	rgbString() {
    		return this._valid ? rgbString(this._rgb) : this._rgb;
    	}
    	hexString() {
    		return this._valid ? hexString(this._rgb) : this._rgb;
    	}
    	hslString() {
    		return this._valid ? hslString(this._rgb) : this._rgb;
    	}
    	mix(color, weight) {
    		const me = this;
    		if (color) {
    			const c1 = me.rgb;
    			const c2 = color.rgb;
    			let w2;
    			const p = weight === w2 ? 0.5 : weight;
    			const w = 2 * p - 1;
    			const a = c1.a - c2.a;
    			const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    			w2 = 1 - w1;
    			c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
    			c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
    			c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
    			c1.a = p * c1.a + (1 - p) * c2.a;
    			me.rgb = c1;
    		}
    		return me;
    	}
    	clone() {
    		return new Color(this.rgb);
    	}
    	alpha(a) {
    		this._rgb.a = n2b(a);
    		return this;
    	}
    	clearer(ratio) {
    		const rgb = this._rgb;
    		rgb.a *= 1 - ratio;
    		return this;
    	}
    	greyscale() {
    		const rgb = this._rgb;
    		const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
    		rgb.r = rgb.g = rgb.b = val;
    		return this;
    	}
    	opaquer(ratio) {
    		const rgb = this._rgb;
    		rgb.a *= 1 + ratio;
    		return this;
    	}
    	negate() {
    		const v = this._rgb;
    		v.r = 255 - v.r;
    		v.g = 255 - v.g;
    		v.b = 255 - v.b;
    		return this;
    	}
    	lighten(ratio) {
    		modHSL(this._rgb, 2, ratio);
    		return this;
    	}
    	darken(ratio) {
    		modHSL(this._rgb, 2, -ratio);
    		return this;
    	}
    	saturate(ratio) {
    		modHSL(this._rgb, 1, ratio);
    		return this;
    	}
    	desaturate(ratio) {
    		modHSL(this._rgb, 1, -ratio);
    		return this;
    	}
    	rotate(deg) {
    		rotate(this._rgb, deg);
    		return this;
    	}
    }
    function index_esm(input) {
    	return new Color(input);
    }

    const isPatternOrGradient = (value) => value instanceof CanvasGradient || value instanceof CanvasPattern;
    function color(value) {
      return isPatternOrGradient(value) ? value : index_esm(value);
    }
    function getHoverColor(value) {
      return isPatternOrGradient(value)
        ? value
        : index_esm(value).saturate(0.5).darken(0.1).hexString();
    }

    const overrides = Object.create(null);
    const descriptors = Object.create(null);
    function getScope$1(node, key) {
      if (!key) {
        return node;
      }
      const keys = key.split('.');
      for (let i = 0, n = keys.length; i < n; ++i) {
        const k = keys[i];
        node = node[k] || (node[k] = Object.create(null));
      }
      return node;
    }
    function set(root, scope, values) {
      if (typeof scope === 'string') {
        return merge(getScope$1(root, scope), values);
      }
      return merge(getScope$1(root, ''), scope);
    }
    class Defaults {
      constructor(_descriptors) {
        this.animation = undefined;
        this.backgroundColor = 'rgba(0,0,0,0.1)';
        this.borderColor = 'rgba(0,0,0,0.1)';
        this.color = '#666';
        this.datasets = {};
        this.devicePixelRatio = (context) => context.chart.platform.getDevicePixelRatio();
        this.elements = {};
        this.events = [
          'mousemove',
          'mouseout',
          'click',
          'touchstart',
          'touchmove'
        ];
        this.font = {
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          size: 12,
          style: 'normal',
          lineHeight: 1.2,
          weight: null
        };
        this.hover = {};
        this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);
        this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);
        this.hoverColor = (ctx, options) => getHoverColor(options.color);
        this.indexAxis = 'x';
        this.interaction = {
          mode: 'nearest',
          intersect: true
        };
        this.maintainAspectRatio = true;
        this.onHover = null;
        this.onClick = null;
        this.parsing = true;
        this.plugins = {};
        this.responsive = true;
        this.scale = undefined;
        this.scales = {};
        this.showLine = true;
        this.drawActiveElementsOnTop = true;
        this.describe(_descriptors);
      }
      set(scope, values) {
        return set(this, scope, values);
      }
      get(scope) {
        return getScope$1(this, scope);
      }
      describe(scope, values) {
        return set(descriptors, scope, values);
      }
      override(scope, values) {
        return set(overrides, scope, values);
      }
      route(scope, name, targetScope, targetName) {
        const scopeObject = getScope$1(this, scope);
        const targetScopeObject = getScope$1(this, targetScope);
        const privateName = '_' + name;
        Object.defineProperties(scopeObject, {
          [privateName]: {
            value: scopeObject[name],
            writable: true
          },
          [name]: {
            enumerable: true,
            get() {
              const local = this[privateName];
              const target = targetScopeObject[targetName];
              if (isObject(local)) {
                return Object.assign({}, target, local);
              }
              return valueOrDefault(local, target);
            },
            set(value) {
              this[privateName] = value;
            }
          }
        });
      }
    }
    var defaults = new Defaults({
      _scriptable: (name) => !name.startsWith('on'),
      _indexable: (name) => name !== 'events',
      hover: {
        _fallback: 'interaction'
      },
      interaction: {
        _scriptable: false,
        _indexable: false,
      }
    });

    function toFontString(font) {
      if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
        return null;
      }
      return (font.style ? font.style + ' ' : '')
    		+ (font.weight ? font.weight + ' ' : '')
    		+ font.size + 'px '
    		+ font.family;
    }
    function _measureText(ctx, data, gc, longest, string) {
      let textWidth = data[string];
      if (!textWidth) {
        textWidth = data[string] = ctx.measureText(string).width;
        gc.push(string);
      }
      if (textWidth > longest) {
        longest = textWidth;
      }
      return longest;
    }
    function _longestText(ctx, font, arrayOfThings, cache) {
      cache = cache || {};
      let data = cache.data = cache.data || {};
      let gc = cache.garbageCollect = cache.garbageCollect || [];
      if (cache.font !== font) {
        data = cache.data = {};
        gc = cache.garbageCollect = [];
        cache.font = font;
      }
      ctx.save();
      ctx.font = font;
      let longest = 0;
      const ilen = arrayOfThings.length;
      let i, j, jlen, thing, nestedThing;
      for (i = 0; i < ilen; i++) {
        thing = arrayOfThings[i];
        if (thing !== undefined && thing !== null && isArray(thing) !== true) {
          longest = _measureText(ctx, data, gc, longest, thing);
        } else if (isArray(thing)) {
          for (j = 0, jlen = thing.length; j < jlen; j++) {
            nestedThing = thing[j];
            if (nestedThing !== undefined && nestedThing !== null && !isArray(nestedThing)) {
              longest = _measureText(ctx, data, gc, longest, nestedThing);
            }
          }
        }
      }
      ctx.restore();
      const gcLen = gc.length / 2;
      if (gcLen > arrayOfThings.length) {
        for (i = 0; i < gcLen; i++) {
          delete data[gc[i]];
        }
        gc.splice(0, gcLen);
      }
      return longest;
    }
    function _alignPixel(chart, pixel, width) {
      const devicePixelRatio = chart.currentDevicePixelRatio;
      const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
      return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
    }
    function clearCanvas(canvas, ctx) {
      ctx = ctx || canvas.getContext('2d');
      ctx.save();
      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    function drawPoint(ctx, options, x, y) {
      let type, xOffset, yOffset, size, cornerRadius;
      const style = options.pointStyle;
      const rotation = options.rotation;
      const radius = options.radius;
      let rad = (rotation || 0) * RAD_PER_DEG;
      if (style && typeof style === 'object') {
        type = style.toString();
        if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rad);
          ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
          ctx.restore();
          return;
        }
      }
      if (isNaN(radius) || radius <= 0) {
        return;
      }
      ctx.beginPath();
      switch (style) {
      default:
        ctx.arc(x, y, radius, 0, TAU);
        ctx.closePath();
        break;
      case 'triangle':
        ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
        rad += TWO_THIRDS_PI;
        ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
        rad += TWO_THIRDS_PI;
        ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
        ctx.closePath();
        break;
      case 'rectRounded':
        cornerRadius = radius * 0.516;
        size = radius - cornerRadius;
        xOffset = Math.cos(rad + QUARTER_PI) * size;
        yOffset = Math.sin(rad + QUARTER_PI) * size;
        ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
        ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
        ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
        ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
        ctx.closePath();
        break;
      case 'rect':
        if (!rotation) {
          size = Math.SQRT1_2 * radius;
          ctx.rect(x - size, y - size, 2 * size, 2 * size);
          break;
        }
        rad += QUARTER_PI;
      case 'rectRot':
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + yOffset, y - xOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.lineTo(x - yOffset, y + xOffset);
        ctx.closePath();
        break;
      case 'crossRot':
        rad += QUARTER_PI;
      case 'cross':
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x + yOffset, y - xOffset);
        ctx.lineTo(x - yOffset, y + xOffset);
        break;
      case 'star':
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x + yOffset, y - xOffset);
        ctx.lineTo(x - yOffset, y + xOffset);
        rad += QUARTER_PI;
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        ctx.moveTo(x + yOffset, y - xOffset);
        ctx.lineTo(x - yOffset, y + xOffset);
        break;
      case 'line':
        xOffset = Math.cos(rad) * radius;
        yOffset = Math.sin(rad) * radius;
        ctx.moveTo(x - xOffset, y - yOffset);
        ctx.lineTo(x + xOffset, y + yOffset);
        break;
      case 'dash':
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
        break;
      }
      ctx.fill();
      if (options.borderWidth > 0) {
        ctx.stroke();
      }
    }
    function _isPointInArea(point, area, margin) {
      margin = margin || 0.5;
      return !area || (point && point.x > area.left - margin && point.x < area.right + margin &&
    		point.y > area.top - margin && point.y < area.bottom + margin);
    }
    function clipArea(ctx, area) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
      ctx.clip();
    }
    function unclipArea(ctx) {
      ctx.restore();
    }
    function _steppedLineTo(ctx, previous, target, flip, mode) {
      if (!previous) {
        return ctx.lineTo(target.x, target.y);
      }
      if (mode === 'middle') {
        const midpoint = (previous.x + target.x) / 2.0;
        ctx.lineTo(midpoint, previous.y);
        ctx.lineTo(midpoint, target.y);
      } else if (mode === 'after' !== !!flip) {
        ctx.lineTo(previous.x, target.y);
      } else {
        ctx.lineTo(target.x, previous.y);
      }
      ctx.lineTo(target.x, target.y);
    }
    function _bezierCurveTo(ctx, previous, target, flip) {
      if (!previous) {
        return ctx.lineTo(target.x, target.y);
      }
      ctx.bezierCurveTo(
        flip ? previous.cp1x : previous.cp2x,
        flip ? previous.cp1y : previous.cp2y,
        flip ? target.cp2x : target.cp1x,
        flip ? target.cp2y : target.cp1y,
        target.x,
        target.y);
    }
    function renderText(ctx, text, x, y, font, opts = {}) {
      const lines = isArray(text) ? text : [text];
      const stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
      let i, line;
      ctx.save();
      ctx.font = font.string;
      setRenderOpts(ctx, opts);
      for (i = 0; i < lines.length; ++i) {
        line = lines[i];
        if (stroke) {
          if (opts.strokeColor) {
            ctx.strokeStyle = opts.strokeColor;
          }
          if (!isNullOrUndef(opts.strokeWidth)) {
            ctx.lineWidth = opts.strokeWidth;
          }
          ctx.strokeText(line, x, y, opts.maxWidth);
        }
        ctx.fillText(line, x, y, opts.maxWidth);
        decorateText(ctx, x, y, line, opts);
        y += font.lineHeight;
      }
      ctx.restore();
    }
    function setRenderOpts(ctx, opts) {
      if (opts.translation) {
        ctx.translate(opts.translation[0], opts.translation[1]);
      }
      if (!isNullOrUndef(opts.rotation)) {
        ctx.rotate(opts.rotation);
      }
      if (opts.color) {
        ctx.fillStyle = opts.color;
      }
      if (opts.textAlign) {
        ctx.textAlign = opts.textAlign;
      }
      if (opts.textBaseline) {
        ctx.textBaseline = opts.textBaseline;
      }
    }
    function decorateText(ctx, x, y, line, opts) {
      if (opts.strikethrough || opts.underline) {
        const metrics = ctx.measureText(line);
        const left = x - metrics.actualBoundingBoxLeft;
        const right = x + metrics.actualBoundingBoxRight;
        const top = y - metrics.actualBoundingBoxAscent;
        const bottom = y + metrics.actualBoundingBoxDescent;
        const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        ctx.lineWidth = opts.decorationWidth || 2;
        ctx.moveTo(left, yDecoration);
        ctx.lineTo(right, yDecoration);
        ctx.stroke();
      }
    }
    function addRoundedRectPath(ctx, rect) {
      const {x, y, w, h, radius} = rect;
      ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
      ctx.lineTo(x, y + h - radius.bottomLeft);
      ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
      ctx.lineTo(x + w - radius.bottomRight, y + h);
      ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
      ctx.lineTo(x + w, y + radius.topRight);
      ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
      ctx.lineTo(x + radius.topLeft, y);
    }

    const LINE_HEIGHT = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
    const FONT_STYLE = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);
    function toLineHeight(value, size) {
      const matches = ('' + value).match(LINE_HEIGHT);
      if (!matches || matches[1] === 'normal') {
        return size * 1.2;
      }
      value = +matches[2];
      switch (matches[3]) {
      case 'px':
        return value;
      case '%':
        value /= 100;
        break;
      }
      return size * value;
    }
    const numberOrZero = v => +v || 0;
    function _readValueToProps(value, props) {
      const ret = {};
      const objProps = isObject(props);
      const keys = objProps ? Object.keys(props) : props;
      const read = isObject(value)
        ? objProps
          ? prop => valueOrDefault(value[prop], value[props[prop]])
          : prop => value[prop]
        : () => value;
      for (const prop of keys) {
        ret[prop] = numberOrZero(read(prop));
      }
      return ret;
    }
    function toTRBL(value) {
      return _readValueToProps(value, {top: 'y', right: 'x', bottom: 'y', left: 'x'});
    }
    function toTRBLCorners(value) {
      return _readValueToProps(value, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
    }
    function toPadding(value) {
      const obj = toTRBL(value);
      obj.width = obj.left + obj.right;
      obj.height = obj.top + obj.bottom;
      return obj;
    }
    function toFont(options, fallback) {
      options = options || {};
      fallback = fallback || defaults.font;
      let size = valueOrDefault(options.size, fallback.size);
      if (typeof size === 'string') {
        size = parseInt(size, 10);
      }
      let style = valueOrDefault(options.style, fallback.style);
      if (style && !('' + style).match(FONT_STYLE)) {
        console.warn('Invalid font style specified: "' + style + '"');
        style = '';
      }
      const font = {
        family: valueOrDefault(options.family, fallback.family),
        lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
        size,
        style,
        weight: valueOrDefault(options.weight, fallback.weight),
        string: ''
      };
      font.string = toFontString(font);
      return font;
    }
    function resolve(inputs, context, index, info) {
      let cacheable = true;
      let i, ilen, value;
      for (i = 0, ilen = inputs.length; i < ilen; ++i) {
        value = inputs[i];
        if (value === undefined) {
          continue;
        }
        if (context !== undefined && typeof value === 'function') {
          value = value(context);
          cacheable = false;
        }
        if (index !== undefined && isArray(value)) {
          value = value[index % value.length];
          cacheable = false;
        }
        if (value !== undefined) {
          if (info && !cacheable) {
            info.cacheable = false;
          }
          return value;
        }
      }
    }
    function _addGrace(minmax, grace, beginAtZero) {
      const {min, max} = minmax;
      const change = toDimension(grace, (max - min) / 2);
      const keepZero = (value, add) => beginAtZero && value === 0 ? 0 : value + add;
      return {
        min: keepZero(min, -Math.abs(change)),
        max: keepZero(max, change)
      };
    }
    function createContext(parentContext, context) {
      return Object.assign(Object.create(parentContext), context);
    }

    function _lookup(table, value, cmp) {
      cmp = cmp || ((index) => table[index] < value);
      let hi = table.length - 1;
      let lo = 0;
      let mid;
      while (hi - lo > 1) {
        mid = (lo + hi) >> 1;
        if (cmp(mid)) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return {lo, hi};
    }
    const _lookupByKey = (table, key, value) =>
      _lookup(table, value, index => table[index][key] < value);
    const _rlookupByKey = (table, key, value) =>
      _lookup(table, value, index => table[index][key] >= value);
    function _filterBetween(values, min, max) {
      let start = 0;
      let end = values.length;
      while (start < end && values[start] < min) {
        start++;
      }
      while (end > start && values[end - 1] > max) {
        end--;
      }
      return start > 0 || end < values.length
        ? values.slice(start, end)
        : values;
    }
    const arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];
    function listenArrayEvents(array, listener) {
      if (array._chartjs) {
        array._chartjs.listeners.push(listener);
        return;
      }
      Object.defineProperty(array, '_chartjs', {
        configurable: true,
        enumerable: false,
        value: {
          listeners: [listener]
        }
      });
      arrayEvents.forEach((key) => {
        const method = '_onData' + _capitalize(key);
        const base = array[key];
        Object.defineProperty(array, key, {
          configurable: true,
          enumerable: false,
          value(...args) {
            const res = base.apply(this, args);
            array._chartjs.listeners.forEach((object) => {
              if (typeof object[method] === 'function') {
                object[method](...args);
              }
            });
            return res;
          }
        });
      });
    }
    function unlistenArrayEvents(array, listener) {
      const stub = array._chartjs;
      if (!stub) {
        return;
      }
      const listeners = stub.listeners;
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
      if (listeners.length > 0) {
        return;
      }
      arrayEvents.forEach((key) => {
        delete array[key];
      });
      delete array._chartjs;
    }
    function _arrayUnique(items) {
      const set = new Set();
      let i, ilen;
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        set.add(items[i]);
      }
      if (set.size === ilen) {
        return items;
      }
      return Array.from(set);
    }

    function _createResolver(scopes, prefixes = [''], rootScopes = scopes, fallback, getTarget = () => scopes[0]) {
      if (!defined(fallback)) {
        fallback = _resolve('_fallback', scopes);
      }
      const cache = {
        [Symbol.toStringTag]: 'Object',
        _cacheable: true,
        _scopes: scopes,
        _rootScopes: rootScopes,
        _fallback: fallback,
        _getTarget: getTarget,
        override: (scope) => _createResolver([scope, ...scopes], prefixes, rootScopes, fallback),
      };
      return new Proxy(cache, {
        deleteProperty(target, prop) {
          delete target[prop];
          delete target._keys;
          delete scopes[0][prop];
          return true;
        },
        get(target, prop) {
          return _cached(target, prop,
            () => _resolveWithPrefixes(prop, prefixes, scopes, target));
        },
        getOwnPropertyDescriptor(target, prop) {
          return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
        },
        getPrototypeOf() {
          return Reflect.getPrototypeOf(scopes[0]);
        },
        has(target, prop) {
          return getKeysFromAllScopes(target).includes(prop);
        },
        ownKeys(target) {
          return getKeysFromAllScopes(target);
        },
        set(target, prop, value) {
          const storage = target._storage || (target._storage = getTarget());
          target[prop] = storage[prop] = value;
          delete target._keys;
          return true;
        }
      });
    }
    function _attachContext(proxy, context, subProxy, descriptorDefaults) {
      const cache = {
        _cacheable: false,
        _proxy: proxy,
        _context: context,
        _subProxy: subProxy,
        _stack: new Set(),
        _descriptors: _descriptors(proxy, descriptorDefaults),
        setContext: (ctx) => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
        override: (scope) => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
      };
      return new Proxy(cache, {
        deleteProperty(target, prop) {
          delete target[prop];
          delete proxy[prop];
          return true;
        },
        get(target, prop, receiver) {
          return _cached(target, prop,
            () => _resolveWithContext(target, prop, receiver));
        },
        getOwnPropertyDescriptor(target, prop) {
          return target._descriptors.allKeys
            ? Reflect.has(proxy, prop) ? {enumerable: true, configurable: true} : undefined
            : Reflect.getOwnPropertyDescriptor(proxy, prop);
        },
        getPrototypeOf() {
          return Reflect.getPrototypeOf(proxy);
        },
        has(target, prop) {
          return Reflect.has(proxy, prop);
        },
        ownKeys() {
          return Reflect.ownKeys(proxy);
        },
        set(target, prop, value) {
          proxy[prop] = value;
          delete target[prop];
          return true;
        }
      });
    }
    function _descriptors(proxy, defaults = {scriptable: true, indexable: true}) {
      const {_scriptable = defaults.scriptable, _indexable = defaults.indexable, _allKeys = defaults.allKeys} = proxy;
      return {
        allKeys: _allKeys,
        scriptable: _scriptable,
        indexable: _indexable,
        isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
        isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
      };
    }
    const readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;
    const needsSubResolver = (prop, value) => isObject(value) && prop !== 'adapters' &&
      (Object.getPrototypeOf(value) === null || value.constructor === Object);
    function _cached(target, prop, resolve) {
      if (Object.prototype.hasOwnProperty.call(target, prop)) {
        return target[prop];
      }
      const value = resolve();
      target[prop] = value;
      return value;
    }
    function _resolveWithContext(target, prop, receiver) {
      const {_proxy, _context, _subProxy, _descriptors: descriptors} = target;
      let value = _proxy[prop];
      if (isFunction(value) && descriptors.isScriptable(prop)) {
        value = _resolveScriptable(prop, value, target, receiver);
      }
      if (isArray(value) && value.length) {
        value = _resolveArray(prop, value, target, descriptors.isIndexable);
      }
      if (needsSubResolver(prop, value)) {
        value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
      }
      return value;
    }
    function _resolveScriptable(prop, value, target, receiver) {
      const {_proxy, _context, _subProxy, _stack} = target;
      if (_stack.has(prop)) {
        throw new Error('Recursion detected: ' + Array.from(_stack).join('->') + '->' + prop);
      }
      _stack.add(prop);
      value = value(_context, _subProxy || receiver);
      _stack.delete(prop);
      if (needsSubResolver(prop, value)) {
        value = createSubResolver(_proxy._scopes, _proxy, prop, value);
      }
      return value;
    }
    function _resolveArray(prop, value, target, isIndexable) {
      const {_proxy, _context, _subProxy, _descriptors: descriptors} = target;
      if (defined(_context.index) && isIndexable(prop)) {
        value = value[_context.index % value.length];
      } else if (isObject(value[0])) {
        const arr = value;
        const scopes = _proxy._scopes.filter(s => s !== arr);
        value = [];
        for (const item of arr) {
          const resolver = createSubResolver(scopes, _proxy, prop, item);
          value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
        }
      }
      return value;
    }
    function resolveFallback(fallback, prop, value) {
      return isFunction(fallback) ? fallback(prop, value) : fallback;
    }
    const getScope = (key, parent) => key === true ? parent
      : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;
    function addScopes(set, parentScopes, key, parentFallback, value) {
      for (const parent of parentScopes) {
        const scope = getScope(key, parent);
        if (scope) {
          set.add(scope);
          const fallback = resolveFallback(scope._fallback, key, value);
          if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
            return fallback;
          }
        } else if (scope === false && defined(parentFallback) && key !== parentFallback) {
          return null;
        }
      }
      return false;
    }
    function createSubResolver(parentScopes, resolver, prop, value) {
      const rootScopes = resolver._rootScopes;
      const fallback = resolveFallback(resolver._fallback, prop, value);
      const allScopes = [...parentScopes, ...rootScopes];
      const set = new Set();
      set.add(value);
      let key = addScopesFromKey(set, allScopes, prop, fallback || prop, value);
      if (key === null) {
        return false;
      }
      if (defined(fallback) && fallback !== prop) {
        key = addScopesFromKey(set, allScopes, fallback, key, value);
        if (key === null) {
          return false;
        }
      }
      return _createResolver(Array.from(set), [''], rootScopes, fallback,
        () => subGetTarget(resolver, prop, value));
    }
    function addScopesFromKey(set, allScopes, key, fallback, item) {
      while (key) {
        key = addScopes(set, allScopes, key, fallback, item);
      }
      return key;
    }
    function subGetTarget(resolver, prop, value) {
      const parent = resolver._getTarget();
      if (!(prop in parent)) {
        parent[prop] = {};
      }
      const target = parent[prop];
      if (isArray(target) && isObject(value)) {
        return value;
      }
      return target;
    }
    function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
      let value;
      for (const prefix of prefixes) {
        value = _resolve(readKey(prefix, prop), scopes);
        if (defined(value)) {
          return needsSubResolver(prop, value)
            ? createSubResolver(scopes, proxy, prop, value)
            : value;
        }
      }
    }
    function _resolve(key, scopes) {
      for (const scope of scopes) {
        if (!scope) {
          continue;
        }
        const value = scope[key];
        if (defined(value)) {
          return value;
        }
      }
    }
    function getKeysFromAllScopes(target) {
      let keys = target._keys;
      if (!keys) {
        keys = target._keys = resolveKeysFromAllScopes(target._scopes);
      }
      return keys;
    }
    function resolveKeysFromAllScopes(scopes) {
      const set = new Set();
      for (const scope of scopes) {
        for (const key of Object.keys(scope).filter(k => !k.startsWith('_'))) {
          set.add(key);
        }
      }
      return Array.from(set);
    }

    const EPSILON = Number.EPSILON || 1e-14;
    const getPoint = (points, i) => i < points.length && !points[i].skip && points[i];
    const getValueAxis = (indexAxis) => indexAxis === 'x' ? 'y' : 'x';
    function splineCurve(firstPoint, middlePoint, afterPoint, t) {
      const previous = firstPoint.skip ? middlePoint : firstPoint;
      const current = middlePoint;
      const next = afterPoint.skip ? middlePoint : afterPoint;
      const d01 = distanceBetweenPoints(current, previous);
      const d12 = distanceBetweenPoints(next, current);
      let s01 = d01 / (d01 + d12);
      let s12 = d12 / (d01 + d12);
      s01 = isNaN(s01) ? 0 : s01;
      s12 = isNaN(s12) ? 0 : s12;
      const fa = t * s01;
      const fb = t * s12;
      return {
        previous: {
          x: current.x - fa * (next.x - previous.x),
          y: current.y - fa * (next.y - previous.y)
        },
        next: {
          x: current.x + fb * (next.x - previous.x),
          y: current.y + fb * (next.y - previous.y)
        }
      };
    }
    function monotoneAdjust(points, deltaK, mK) {
      const pointsLen = points.length;
      let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
      let pointAfter = getPoint(points, 0);
      for (let i = 0; i < pointsLen - 1; ++i) {
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent || !pointAfter) {
          continue;
        }
        if (almostEquals(deltaK[i], 0, EPSILON)) {
          mK[i] = mK[i + 1] = 0;
          continue;
        }
        alphaK = mK[i] / deltaK[i];
        betaK = mK[i + 1] / deltaK[i];
        squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);
        if (squaredMagnitude <= 9) {
          continue;
        }
        tauK = 3 / Math.sqrt(squaredMagnitude);
        mK[i] = alphaK * tauK * deltaK[i];
        mK[i + 1] = betaK * tauK * deltaK[i];
      }
    }
    function monotoneCompute(points, mK, indexAxis = 'x') {
      const valueAxis = getValueAxis(indexAxis);
      const pointsLen = points.length;
      let delta, pointBefore, pointCurrent;
      let pointAfter = getPoint(points, 0);
      for (let i = 0; i < pointsLen; ++i) {
        pointBefore = pointCurrent;
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent) {
          continue;
        }
        const iPixel = pointCurrent[indexAxis];
        const vPixel = pointCurrent[valueAxis];
        if (pointBefore) {
          delta = (iPixel - pointBefore[indexAxis]) / 3;
          pointCurrent[`cp1${indexAxis}`] = iPixel - delta;
          pointCurrent[`cp1${valueAxis}`] = vPixel - delta * mK[i];
        }
        if (pointAfter) {
          delta = (pointAfter[indexAxis] - iPixel) / 3;
          pointCurrent[`cp2${indexAxis}`] = iPixel + delta;
          pointCurrent[`cp2${valueAxis}`] = vPixel + delta * mK[i];
        }
      }
    }
    function splineCurveMonotone(points, indexAxis = 'x') {
      const valueAxis = getValueAxis(indexAxis);
      const pointsLen = points.length;
      const deltaK = Array(pointsLen).fill(0);
      const mK = Array(pointsLen);
      let i, pointBefore, pointCurrent;
      let pointAfter = getPoint(points, 0);
      for (i = 0; i < pointsLen; ++i) {
        pointBefore = pointCurrent;
        pointCurrent = pointAfter;
        pointAfter = getPoint(points, i + 1);
        if (!pointCurrent) {
          continue;
        }
        if (pointAfter) {
          const slopeDelta = pointAfter[indexAxis] - pointCurrent[indexAxis];
          deltaK[i] = slopeDelta !== 0 ? (pointAfter[valueAxis] - pointCurrent[valueAxis]) / slopeDelta : 0;
        }
        mK[i] = !pointBefore ? deltaK[i]
          : !pointAfter ? deltaK[i - 1]
          : (sign(deltaK[i - 1]) !== sign(deltaK[i])) ? 0
          : (deltaK[i - 1] + deltaK[i]) / 2;
      }
      monotoneAdjust(points, deltaK, mK);
      monotoneCompute(points, mK, indexAxis);
    }
    function capControlPoint(pt, min, max) {
      return Math.max(Math.min(pt, max), min);
    }
    function capBezierPoints(points, area) {
      let i, ilen, point, inArea, inAreaPrev;
      let inAreaNext = _isPointInArea(points[0], area);
      for (i = 0, ilen = points.length; i < ilen; ++i) {
        inAreaPrev = inArea;
        inArea = inAreaNext;
        inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);
        if (!inArea) {
          continue;
        }
        point = points[i];
        if (inAreaPrev) {
          point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
          point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
        }
        if (inAreaNext) {
          point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
          point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
        }
      }
    }
    function _updateBezierControlPoints(points, options, area, loop, indexAxis) {
      let i, ilen, point, controlPoints;
      if (options.spanGaps) {
        points = points.filter((pt) => !pt.skip);
      }
      if (options.cubicInterpolationMode === 'monotone') {
        splineCurveMonotone(points, indexAxis);
      } else {
        let prev = loop ? points[points.length - 1] : points[0];
        for (i = 0, ilen = points.length; i < ilen; ++i) {
          point = points[i];
          controlPoints = splineCurve(
            prev,
            point,
            points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen],
            options.tension
          );
          point.cp1x = controlPoints.previous.x;
          point.cp1y = controlPoints.previous.y;
          point.cp2x = controlPoints.next.x;
          point.cp2y = controlPoints.next.y;
          prev = point;
        }
      }
      if (options.capBezierPoints) {
        capBezierPoints(points, area);
      }
    }

    function _isDomSupported() {
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    }
    function _getParentNode(domNode) {
      let parent = domNode.parentNode;
      if (parent && parent.toString() === '[object ShadowRoot]') {
        parent = parent.host;
      }
      return parent;
    }
    function parseMaxStyle(styleValue, node, parentProperty) {
      let valueInPixels;
      if (typeof styleValue === 'string') {
        valueInPixels = parseInt(styleValue, 10);
        if (styleValue.indexOf('%') !== -1) {
          valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
        }
      } else {
        valueInPixels = styleValue;
      }
      return valueInPixels;
    }
    const getComputedStyle$1 = (element) => window.getComputedStyle(element, null);
    function getStyle(el, property) {
      return getComputedStyle$1(el).getPropertyValue(property);
    }
    const positions = ['top', 'right', 'bottom', 'left'];
    function getPositionedStyle(styles, style, suffix) {
      const result = {};
      suffix = suffix ? '-' + suffix : '';
      for (let i = 0; i < 4; i++) {
        const pos = positions[i];
        result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
      }
      result.width = result.left + result.right;
      result.height = result.top + result.bottom;
      return result;
    }
    const useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);
    function getCanvasPosition(evt, canvas) {
      const e = evt.native || evt;
      const touches = e.touches;
      const source = touches && touches.length ? touches[0] : e;
      const {offsetX, offsetY} = source;
      let box = false;
      let x, y;
      if (useOffsetPos(offsetX, offsetY, e.target)) {
        x = offsetX;
        y = offsetY;
      } else {
        const rect = canvas.getBoundingClientRect();
        x = source.clientX - rect.left;
        y = source.clientY - rect.top;
        box = true;
      }
      return {x, y, box};
    }
    function getRelativePosition$1(evt, chart) {
      const {canvas, currentDevicePixelRatio} = chart;
      const style = getComputedStyle$1(canvas);
      const borderBox = style.boxSizing === 'border-box';
      const paddings = getPositionedStyle(style, 'padding');
      const borders = getPositionedStyle(style, 'border', 'width');
      const {x, y, box} = getCanvasPosition(evt, canvas);
      const xOffset = paddings.left + (box && borders.left);
      const yOffset = paddings.top + (box && borders.top);
      let {width, height} = chart;
      if (borderBox) {
        width -= paddings.width + borders.width;
        height -= paddings.height + borders.height;
      }
      return {
        x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
        y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
      };
    }
    function getContainerSize(canvas, width, height) {
      let maxWidth, maxHeight;
      if (width === undefined || height === undefined) {
        const container = _getParentNode(canvas);
        if (!container) {
          width = canvas.clientWidth;
          height = canvas.clientHeight;
        } else {
          const rect = container.getBoundingClientRect();
          const containerStyle = getComputedStyle$1(container);
          const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
          const containerPadding = getPositionedStyle(containerStyle, 'padding');
          width = rect.width - containerPadding.width - containerBorder.width;
          height = rect.height - containerPadding.height - containerBorder.height;
          maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
          maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
        }
      }
      return {
        width,
        height,
        maxWidth: maxWidth || INFINITY,
        maxHeight: maxHeight || INFINITY
      };
    }
    const round1 = v => Math.round(v * 10) / 10;
    function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
      const style = getComputedStyle$1(canvas);
      const margins = getPositionedStyle(style, 'margin');
      const maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
      const maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
      const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
      let {width, height} = containerSize;
      if (style.boxSizing === 'content-box') {
        const borders = getPositionedStyle(style, 'border', 'width');
        const paddings = getPositionedStyle(style, 'padding');
        width -= paddings.width + borders.width;
        height -= paddings.height + borders.height;
      }
      width = Math.max(0, width - margins.width);
      height = Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height - margins.height);
      width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
      height = round1(Math.min(height, maxHeight, containerSize.maxHeight));
      if (width && !height) {
        height = round1(width / 2);
      }
      return {
        width,
        height
      };
    }
    function retinaScale(chart, forceRatio, forceStyle) {
      const pixelRatio = forceRatio || 1;
      const deviceHeight = Math.floor(chart.height * pixelRatio);
      const deviceWidth = Math.floor(chart.width * pixelRatio);
      chart.height = deviceHeight / pixelRatio;
      chart.width = deviceWidth / pixelRatio;
      const canvas = chart.canvas;
      if (canvas.style && (forceStyle || (!canvas.style.height && !canvas.style.width))) {
        canvas.style.height = `${chart.height}px`;
        canvas.style.width = `${chart.width}px`;
      }
      if (chart.currentDevicePixelRatio !== pixelRatio
          || canvas.height !== deviceHeight
          || canvas.width !== deviceWidth) {
        chart.currentDevicePixelRatio = pixelRatio;
        canvas.height = deviceHeight;
        canvas.width = deviceWidth;
        chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        return true;
      }
      return false;
    }
    const supportsEventListenerOptions = (function() {
      let passiveSupported = false;
      try {
        const options = {
          get passive() {
            passiveSupported = true;
            return false;
          }
        };
        window.addEventListener('test', null, options);
        window.removeEventListener('test', null, options);
      } catch (e) {
      }
      return passiveSupported;
    }());
    function readUsedSize(element, property) {
      const value = getStyle(element, property);
      const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
      return matches ? +matches[1] : undefined;
    }

    function _pointInLine(p1, p2, t, mode) {
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y)
      };
    }
    function _steppedInterpolation(p1, p2, t, mode) {
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y
        : mode === 'after' ? t < 1 ? p1.y : p2.y
        : t > 0 ? p2.y : p1.y
      };
    }
    function _bezierInterpolation(p1, p2, t, mode) {
      const cp1 = {x: p1.cp2x, y: p1.cp2y};
      const cp2 = {x: p2.cp1x, y: p2.cp1y};
      const a = _pointInLine(p1, cp1, t);
      const b = _pointInLine(cp1, cp2, t);
      const c = _pointInLine(cp2, p2, t);
      const d = _pointInLine(a, b, t);
      const e = _pointInLine(b, c, t);
      return _pointInLine(d, e, t);
    }

    const intlCache = new Map();
    function getNumberFormat(locale, options) {
      options = options || {};
      const cacheKey = locale + JSON.stringify(options);
      let formatter = intlCache.get(cacheKey);
      if (!formatter) {
        formatter = new Intl.NumberFormat(locale, options);
        intlCache.set(cacheKey, formatter);
      }
      return formatter;
    }
    function formatNumber(num, locale, options) {
      return getNumberFormat(locale, options).format(num);
    }

    const getRightToLeftAdapter = function(rectX, width) {
      return {
        x(x) {
          return rectX + rectX + width - x;
        },
        setWidth(w) {
          width = w;
        },
        textAlign(align) {
          if (align === 'center') {
            return align;
          }
          return align === 'right' ? 'left' : 'right';
        },
        xPlus(x, value) {
          return x - value;
        },
        leftForLtr(x, itemWidth) {
          return x - itemWidth;
        },
      };
    };
    const getLeftToRightAdapter = function() {
      return {
        x(x) {
          return x;
        },
        setWidth(w) {
        },
        textAlign(align) {
          return align;
        },
        xPlus(x, value) {
          return x + value;
        },
        leftForLtr(x, _itemWidth) {
          return x;
        },
      };
    };
    function getRtlAdapter(rtl, rectX, width) {
      return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
    }
    function overrideTextDirection(ctx, direction) {
      let style, original;
      if (direction === 'ltr' || direction === 'rtl') {
        style = ctx.canvas.style;
        original = [
          style.getPropertyValue('direction'),
          style.getPropertyPriority('direction'),
        ];
        style.setProperty('direction', direction, 'important');
        ctx.prevTextDirection = original;
      }
    }
    function restoreTextDirection(ctx, original) {
      if (original !== undefined) {
        delete ctx.prevTextDirection;
        ctx.canvas.style.setProperty('direction', original[0], original[1]);
      }
    }

    function propertyFn(property) {
      if (property === 'angle') {
        return {
          between: _angleBetween,
          compare: _angleDiff,
          normalize: _normalizeAngle,
        };
      }
      return {
        between: _isBetween,
        compare: (a, b) => a - b,
        normalize: x => x
      };
    }
    function normalizeSegment({start, end, count, loop, style}) {
      return {
        start: start % count,
        end: end % count,
        loop: loop && (end - start + 1) % count === 0,
        style
      };
    }
    function getSegment(segment, points, bounds) {
      const {property, start: startBound, end: endBound} = bounds;
      const {between, normalize} = propertyFn(property);
      const count = points.length;
      let {start, end, loop} = segment;
      let i, ilen;
      if (loop) {
        start += count;
        end += count;
        for (i = 0, ilen = count; i < ilen; ++i) {
          if (!between(normalize(points[start % count][property]), startBound, endBound)) {
            break;
          }
          start--;
          end--;
        }
        start %= count;
        end %= count;
      }
      if (end < start) {
        end += count;
      }
      return {start, end, loop, style: segment.style};
    }
    function _boundSegment(segment, points, bounds) {
      if (!bounds) {
        return [segment];
      }
      const {property, start: startBound, end: endBound} = bounds;
      const count = points.length;
      const {compare, between, normalize} = propertyFn(property);
      const {start, end, loop, style} = getSegment(segment, points, bounds);
      const result = [];
      let inside = false;
      let subStart = null;
      let value, point, prevValue;
      const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;
      const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);
      const shouldStart = () => inside || startIsBefore();
      const shouldStop = () => !inside || endIsBefore();
      for (let i = start, prev = start; i <= end; ++i) {
        point = points[i % count];
        if (point.skip) {
          continue;
        }
        value = normalize(point[property]);
        if (value === prevValue) {
          continue;
        }
        inside = between(value, startBound, endBound);
        if (subStart === null && shouldStart()) {
          subStart = compare(value, startBound) === 0 ? i : prev;
        }
        if (subStart !== null && shouldStop()) {
          result.push(normalizeSegment({start: subStart, end: i, loop, count, style}));
          subStart = null;
        }
        prev = i;
        prevValue = value;
      }
      if (subStart !== null) {
        result.push(normalizeSegment({start: subStart, end, loop, count, style}));
      }
      return result;
    }
    function _boundSegments(line, bounds) {
      const result = [];
      const segments = line.segments;
      for (let i = 0; i < segments.length; i++) {
        const sub = _boundSegment(segments[i], line.points, bounds);
        if (sub.length) {
          result.push(...sub);
        }
      }
      return result;
    }
    function findStartAndEnd(points, count, loop, spanGaps) {
      let start = 0;
      let end = count - 1;
      if (loop && !spanGaps) {
        while (start < count && !points[start].skip) {
          start++;
        }
      }
      while (start < count && points[start].skip) {
        start++;
      }
      start %= count;
      if (loop) {
        end += start;
      }
      while (end > start && points[end % count].skip) {
        end--;
      }
      end %= count;
      return {start, end};
    }
    function solidSegments(points, start, max, loop) {
      const count = points.length;
      const result = [];
      let last = start;
      let prev = points[start];
      let end;
      for (end = start + 1; end <= max; ++end) {
        const cur = points[end % count];
        if (cur.skip || cur.stop) {
          if (!prev.skip) {
            loop = false;
            result.push({start: start % count, end: (end - 1) % count, loop});
            start = last = cur.stop ? end : null;
          }
        } else {
          last = end;
          if (prev.skip) {
            start = end;
          }
        }
        prev = cur;
      }
      if (last !== null) {
        result.push({start: start % count, end: last % count, loop});
      }
      return result;
    }
    function _computeSegments(line, segmentOptions) {
      const points = line.points;
      const spanGaps = line.options.spanGaps;
      const count = points.length;
      if (!count) {
        return [];
      }
      const loop = !!line._loop;
      const {start, end} = findStartAndEnd(points, count, loop, spanGaps);
      if (spanGaps === true) {
        return splitByStyles(line, [{start, end, loop}], points, segmentOptions);
      }
      const max = end < start ? end + count : end;
      const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
      return splitByStyles(line, solidSegments(points, start, max, completeLoop), points, segmentOptions);
    }
    function splitByStyles(line, segments, points, segmentOptions) {
      if (!segmentOptions || !segmentOptions.setContext || !points) {
        return segments;
      }
      return doSplitByStyles(line, segments, points, segmentOptions);
    }
    function doSplitByStyles(line, segments, points, segmentOptions) {
      const chartContext = line._chart.getContext();
      const baseStyle = readStyle(line.options);
      const {_datasetIndex: datasetIndex, options: {spanGaps}} = line;
      const count = points.length;
      const result = [];
      let prevStyle = baseStyle;
      let start = segments[0].start;
      let i = start;
      function addStyle(s, e, l, st) {
        const dir = spanGaps ? -1 : 1;
        if (s === e) {
          return;
        }
        s += count;
        while (points[s % count].skip) {
          s -= dir;
        }
        while (points[e % count].skip) {
          e += dir;
        }
        if (s % count !== e % count) {
          result.push({start: s % count, end: e % count, loop: l, style: st});
          prevStyle = st;
          start = e % count;
        }
      }
      for (const segment of segments) {
        start = spanGaps ? start : segment.start;
        let prev = points[start % count];
        let style;
        for (i = start + 1; i <= segment.end; i++) {
          const pt = points[i % count];
          style = readStyle(segmentOptions.setContext(createContext(chartContext, {
            type: 'segment',
            p0: prev,
            p1: pt,
            p0DataIndex: (i - 1) % count,
            p1DataIndex: i % count,
            datasetIndex
          })));
          if (styleChanged(style, prevStyle)) {
            addStyle(start, i - 1, segment.loop, prevStyle);
          }
          prev = pt;
          prevStyle = style;
        }
        if (start < i - 1) {
          addStyle(start, i - 1, segment.loop, prevStyle);
        }
      }
      return result;
    }
    function readStyle(options) {
      return {
        backgroundColor: options.backgroundColor,
        borderCapStyle: options.borderCapStyle,
        borderDash: options.borderDash,
        borderDashOffset: options.borderDashOffset,
        borderJoinStyle: options.borderJoinStyle,
        borderWidth: options.borderWidth,
        borderColor: options.borderColor
      };
    }
    function styleChanged(style, prevStyle) {
      return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
    }

    /*!
     * Chart.js v3.7.1
     * https://www.chartjs.org
     * (c) 2022 Chart.js Contributors
     * Released under the MIT License
     */

    class Animator {
      constructor() {
        this._request = null;
        this._charts = new Map();
        this._running = false;
        this._lastDate = undefined;
      }
      _notify(chart, anims, date, type) {
        const callbacks = anims.listeners[type];
        const numSteps = anims.duration;
        callbacks.forEach(fn => fn({
          chart,
          initial: anims.initial,
          numSteps,
          currentStep: Math.min(date - anims.start, numSteps)
        }));
      }
      _refresh() {
        if (this._request) {
          return;
        }
        this._running = true;
        this._request = requestAnimFrame.call(window, () => {
          this._update();
          this._request = null;
          if (this._running) {
            this._refresh();
          }
        });
      }
      _update(date = Date.now()) {
        let remaining = 0;
        this._charts.forEach((anims, chart) => {
          if (!anims.running || !anims.items.length) {
            return;
          }
          const items = anims.items;
          let i = items.length - 1;
          let draw = false;
          let item;
          for (; i >= 0; --i) {
            item = items[i];
            if (item._active) {
              if (item._total > anims.duration) {
                anims.duration = item._total;
              }
              item.tick(date);
              draw = true;
            } else {
              items[i] = items[items.length - 1];
              items.pop();
            }
          }
          if (draw) {
            chart.draw();
            this._notify(chart, anims, date, 'progress');
          }
          if (!items.length) {
            anims.running = false;
            this._notify(chart, anims, date, 'complete');
            anims.initial = false;
          }
          remaining += items.length;
        });
        this._lastDate = date;
        if (remaining === 0) {
          this._running = false;
        }
      }
      _getAnims(chart) {
        const charts = this._charts;
        let anims = charts.get(chart);
        if (!anims) {
          anims = {
            running: false,
            initial: true,
            items: [],
            listeners: {
              complete: [],
              progress: []
            }
          };
          charts.set(chart, anims);
        }
        return anims;
      }
      listen(chart, event, cb) {
        this._getAnims(chart).listeners[event].push(cb);
      }
      add(chart, items) {
        if (!items || !items.length) {
          return;
        }
        this._getAnims(chart).items.push(...items);
      }
      has(chart) {
        return this._getAnims(chart).items.length > 0;
      }
      start(chart) {
        const anims = this._charts.get(chart);
        if (!anims) {
          return;
        }
        anims.running = true;
        anims.start = Date.now();
        anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);
        this._refresh();
      }
      running(chart) {
        if (!this._running) {
          return false;
        }
        const anims = this._charts.get(chart);
        if (!anims || !anims.running || !anims.items.length) {
          return false;
        }
        return true;
      }
      stop(chart) {
        const anims = this._charts.get(chart);
        if (!anims || !anims.items.length) {
          return;
        }
        const items = anims.items;
        let i = items.length - 1;
        for (; i >= 0; --i) {
          items[i].cancel();
        }
        anims.items = [];
        this._notify(chart, anims, Date.now(), 'complete');
      }
      remove(chart) {
        return this._charts.delete(chart);
      }
    }
    var animator = new Animator();

    const transparent = 'transparent';
    const interpolators = {
      boolean(from, to, factor) {
        return factor > 0.5 ? to : from;
      },
      color(from, to, factor) {
        const c0 = color(from || transparent);
        const c1 = c0.valid && color(to || transparent);
        return c1 && c1.valid
          ? c1.mix(c0, factor).hexString()
          : to;
      },
      number(from, to, factor) {
        return from + (to - from) * factor;
      }
    };
    class Animation {
      constructor(cfg, target, prop, to) {
        const currentValue = target[prop];
        to = resolve([cfg.to, to, currentValue, cfg.from]);
        const from = resolve([cfg.from, currentValue, to]);
        this._active = true;
        this._fn = cfg.fn || interpolators[cfg.type || typeof from];
        this._easing = effects[cfg.easing] || effects.linear;
        this._start = Math.floor(Date.now() + (cfg.delay || 0));
        this._duration = this._total = Math.floor(cfg.duration);
        this._loop = !!cfg.loop;
        this._target = target;
        this._prop = prop;
        this._from = from;
        this._to = to;
        this._promises = undefined;
      }
      active() {
        return this._active;
      }
      update(cfg, to, date) {
        if (this._active) {
          this._notify(false);
          const currentValue = this._target[this._prop];
          const elapsed = date - this._start;
          const remain = this._duration - elapsed;
          this._start = date;
          this._duration = Math.floor(Math.max(remain, cfg.duration));
          this._total += elapsed;
          this._loop = !!cfg.loop;
          this._to = resolve([cfg.to, to, currentValue, cfg.from]);
          this._from = resolve([cfg.from, currentValue, to]);
        }
      }
      cancel() {
        if (this._active) {
          this.tick(Date.now());
          this._active = false;
          this._notify(false);
        }
      }
      tick(date) {
        const elapsed = date - this._start;
        const duration = this._duration;
        const prop = this._prop;
        const from = this._from;
        const loop = this._loop;
        const to = this._to;
        let factor;
        this._active = from !== to && (loop || (elapsed < duration));
        if (!this._active) {
          this._target[prop] = to;
          this._notify(true);
          return;
        }
        if (elapsed < 0) {
          this._target[prop] = from;
          return;
        }
        factor = (elapsed / duration) % 2;
        factor = loop && factor > 1 ? 2 - factor : factor;
        factor = this._easing(Math.min(1, Math.max(0, factor)));
        this._target[prop] = this._fn(from, to, factor);
      }
      wait() {
        const promises = this._promises || (this._promises = []);
        return new Promise((res, rej) => {
          promises.push({res, rej});
        });
      }
      _notify(resolved) {
        const method = resolved ? 'res' : 'rej';
        const promises = this._promises || [];
        for (let i = 0; i < promises.length; i++) {
          promises[i][method]();
        }
      }
    }

    const numbers = ['x', 'y', 'borderWidth', 'radius', 'tension'];
    const colors = ['color', 'borderColor', 'backgroundColor'];
    defaults.set('animation', {
      delay: undefined,
      duration: 1000,
      easing: 'easeOutQuart',
      fn: undefined,
      from: undefined,
      loop: undefined,
      to: undefined,
      type: undefined,
    });
    const animationOptions = Object.keys(defaults.animation);
    defaults.describe('animation', {
      _fallback: false,
      _indexable: false,
      _scriptable: (name) => name !== 'onProgress' && name !== 'onComplete' && name !== 'fn',
    });
    defaults.set('animations', {
      colors: {
        type: 'color',
        properties: colors
      },
      numbers: {
        type: 'number',
        properties: numbers
      },
    });
    defaults.describe('animations', {
      _fallback: 'animation',
    });
    defaults.set('transitions', {
      active: {
        animation: {
          duration: 400
        }
      },
      resize: {
        animation: {
          duration: 0
        }
      },
      show: {
        animations: {
          colors: {
            from: 'transparent'
          },
          visible: {
            type: 'boolean',
            duration: 0
          },
        }
      },
      hide: {
        animations: {
          colors: {
            to: 'transparent'
          },
          visible: {
            type: 'boolean',
            easing: 'linear',
            fn: v => v | 0
          },
        }
      }
    });
    class Animations {
      constructor(chart, config) {
        this._chart = chart;
        this._properties = new Map();
        this.configure(config);
      }
      configure(config) {
        if (!isObject(config)) {
          return;
        }
        const animatedProps = this._properties;
        Object.getOwnPropertyNames(config).forEach(key => {
          const cfg = config[key];
          if (!isObject(cfg)) {
            return;
          }
          const resolved = {};
          for (const option of animationOptions) {
            resolved[option] = cfg[option];
          }
          (isArray(cfg.properties) && cfg.properties || [key]).forEach((prop) => {
            if (prop === key || !animatedProps.has(prop)) {
              animatedProps.set(prop, resolved);
            }
          });
        });
      }
      _animateOptions(target, values) {
        const newOptions = values.options;
        const options = resolveTargetOptions(target, newOptions);
        if (!options) {
          return [];
        }
        const animations = this._createAnimations(options, newOptions);
        if (newOptions.$shared) {
          awaitAll(target.options.$animations, newOptions).then(() => {
            target.options = newOptions;
          }, () => {
          });
        }
        return animations;
      }
      _createAnimations(target, values) {
        const animatedProps = this._properties;
        const animations = [];
        const running = target.$animations || (target.$animations = {});
        const props = Object.keys(values);
        const date = Date.now();
        let i;
        for (i = props.length - 1; i >= 0; --i) {
          const prop = props[i];
          if (prop.charAt(0) === '$') {
            continue;
          }
          if (prop === 'options') {
            animations.push(...this._animateOptions(target, values));
            continue;
          }
          const value = values[prop];
          let animation = running[prop];
          const cfg = animatedProps.get(prop);
          if (animation) {
            if (cfg && animation.active()) {
              animation.update(cfg, value, date);
              continue;
            } else {
              animation.cancel();
            }
          }
          if (!cfg || !cfg.duration) {
            target[prop] = value;
            continue;
          }
          running[prop] = animation = new Animation(cfg, target, prop, value);
          animations.push(animation);
        }
        return animations;
      }
      update(target, values) {
        if (this._properties.size === 0) {
          Object.assign(target, values);
          return;
        }
        const animations = this._createAnimations(target, values);
        if (animations.length) {
          animator.add(this._chart, animations);
          return true;
        }
      }
    }
    function awaitAll(animations, properties) {
      const running = [];
      const keys = Object.keys(properties);
      for (let i = 0; i < keys.length; i++) {
        const anim = animations[keys[i]];
        if (anim && anim.active()) {
          running.push(anim.wait());
        }
      }
      return Promise.all(running);
    }
    function resolveTargetOptions(target, newOptions) {
      if (!newOptions) {
        return;
      }
      let options = target.options;
      if (!options) {
        target.options = newOptions;
        return;
      }
      if (options.$shared) {
        target.options = options = Object.assign({}, options, {$shared: false, $animations: {}});
      }
      return options;
    }

    function scaleClip(scale, allowedOverflow) {
      const opts = scale && scale.options || {};
      const reverse = opts.reverse;
      const min = opts.min === undefined ? allowedOverflow : 0;
      const max = opts.max === undefined ? allowedOverflow : 0;
      return {
        start: reverse ? max : min,
        end: reverse ? min : max
      };
    }
    function defaultClip(xScale, yScale, allowedOverflow) {
      if (allowedOverflow === false) {
        return false;
      }
      const x = scaleClip(xScale, allowedOverflow);
      const y = scaleClip(yScale, allowedOverflow);
      return {
        top: y.end,
        right: x.end,
        bottom: y.start,
        left: x.start
      };
    }
    function toClip(value) {
      let t, r, b, l;
      if (isObject(value)) {
        t = value.top;
        r = value.right;
        b = value.bottom;
        l = value.left;
      } else {
        t = r = b = l = value;
      }
      return {
        top: t,
        right: r,
        bottom: b,
        left: l,
        disabled: value === false
      };
    }
    function getSortedDatasetIndices(chart, filterVisible) {
      const keys = [];
      const metasets = chart._getSortedDatasetMetas(filterVisible);
      let i, ilen;
      for (i = 0, ilen = metasets.length; i < ilen; ++i) {
        keys.push(metasets[i].index);
      }
      return keys;
    }
    function applyStack(stack, value, dsIndex, options = {}) {
      const keys = stack.keys;
      const singleMode = options.mode === 'single';
      let i, ilen, datasetIndex, otherValue;
      if (value === null) {
        return;
      }
      for (i = 0, ilen = keys.length; i < ilen; ++i) {
        datasetIndex = +keys[i];
        if (datasetIndex === dsIndex) {
          if (options.all) {
            continue;
          }
          break;
        }
        otherValue = stack.values[datasetIndex];
        if (isNumberFinite(otherValue) && (singleMode || (value === 0 || sign(value) === sign(otherValue)))) {
          value += otherValue;
        }
      }
      return value;
    }
    function convertObjectDataToArray(data) {
      const keys = Object.keys(data);
      const adata = new Array(keys.length);
      let i, ilen, key;
      for (i = 0, ilen = keys.length; i < ilen; ++i) {
        key = keys[i];
        adata[i] = {
          x: key,
          y: data[key]
        };
      }
      return adata;
    }
    function isStacked(scale, meta) {
      const stacked = scale && scale.options.stacked;
      return stacked || (stacked === undefined && meta.stack !== undefined);
    }
    function getStackKey(indexScale, valueScale, meta) {
      return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
    }
    function getUserBounds(scale) {
      const {min, max, minDefined, maxDefined} = scale.getUserBounds();
      return {
        min: minDefined ? min : Number.NEGATIVE_INFINITY,
        max: maxDefined ? max : Number.POSITIVE_INFINITY
      };
    }
    function getOrCreateStack(stacks, stackKey, indexValue) {
      const subStack = stacks[stackKey] || (stacks[stackKey] = {});
      return subStack[indexValue] || (subStack[indexValue] = {});
    }
    function getLastIndexInStack(stack, vScale, positive, type) {
      for (const meta of vScale.getMatchingVisibleMetas(type).reverse()) {
        const value = stack[meta.index];
        if ((positive && value > 0) || (!positive && value < 0)) {
          return meta.index;
        }
      }
      return null;
    }
    function updateStacks(controller, parsed) {
      const {chart, _cachedMeta: meta} = controller;
      const stacks = chart._stacks || (chart._stacks = {});
      const {iScale, vScale, index: datasetIndex} = meta;
      const iAxis = iScale.axis;
      const vAxis = vScale.axis;
      const key = getStackKey(iScale, vScale, meta);
      const ilen = parsed.length;
      let stack;
      for (let i = 0; i < ilen; ++i) {
        const item = parsed[i];
        const {[iAxis]: index, [vAxis]: value} = item;
        const itemStacks = item._stacks || (item._stacks = {});
        stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
        stack[datasetIndex] = value;
        stack._top = getLastIndexInStack(stack, vScale, true, meta.type);
        stack._bottom = getLastIndexInStack(stack, vScale, false, meta.type);
      }
    }
    function getFirstScaleId(chart, axis) {
      const scales = chart.scales;
      return Object.keys(scales).filter(key => scales[key].axis === axis).shift();
    }
    function createDatasetContext(parent, index) {
      return createContext(parent,
        {
          active: false,
          dataset: undefined,
          datasetIndex: index,
          index,
          mode: 'default',
          type: 'dataset'
        }
      );
    }
    function createDataContext(parent, index, element) {
      return createContext(parent, {
        active: false,
        dataIndex: index,
        parsed: undefined,
        raw: undefined,
        element,
        index,
        mode: 'default',
        type: 'data'
      });
    }
    function clearStacks(meta, items) {
      const datasetIndex = meta.controller.index;
      const axis = meta.vScale && meta.vScale.axis;
      if (!axis) {
        return;
      }
      items = items || meta._parsed;
      for (const parsed of items) {
        const stacks = parsed._stacks;
        if (!stacks || stacks[axis] === undefined || stacks[axis][datasetIndex] === undefined) {
          return;
        }
        delete stacks[axis][datasetIndex];
      }
    }
    const isDirectUpdateMode = (mode) => mode === 'reset' || mode === 'none';
    const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);
    const createStack = (canStack, meta, chart) => canStack && !meta.hidden && meta._stacked
      && {keys: getSortedDatasetIndices(chart, true), values: null};
    class DatasetController {
      constructor(chart, datasetIndex) {
        this.chart = chart;
        this._ctx = chart.ctx;
        this.index = datasetIndex;
        this._cachedDataOpts = {};
        this._cachedMeta = this.getMeta();
        this._type = this._cachedMeta.type;
        this.options = undefined;
        this._parsing = false;
        this._data = undefined;
        this._objectData = undefined;
        this._sharedOptions = undefined;
        this._drawStart = undefined;
        this._drawCount = undefined;
        this.enableOptionSharing = false;
        this.$context = undefined;
        this._syncList = [];
        this.initialize();
      }
      initialize() {
        const meta = this._cachedMeta;
        this.configure();
        this.linkScales();
        meta._stacked = isStacked(meta.vScale, meta);
        this.addElements();
      }
      updateIndex(datasetIndex) {
        if (this.index !== datasetIndex) {
          clearStacks(this._cachedMeta);
        }
        this.index = datasetIndex;
      }
      linkScales() {
        const chart = this.chart;
        const meta = this._cachedMeta;
        const dataset = this.getDataset();
        const chooseId = (axis, x, y, r) => axis === 'x' ? x : axis === 'r' ? r : y;
        const xid = meta.xAxisID = valueOrDefault(dataset.xAxisID, getFirstScaleId(chart, 'x'));
        const yid = meta.yAxisID = valueOrDefault(dataset.yAxisID, getFirstScaleId(chart, 'y'));
        const rid = meta.rAxisID = valueOrDefault(dataset.rAxisID, getFirstScaleId(chart, 'r'));
        const indexAxis = meta.indexAxis;
        const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
        const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
        meta.xScale = this.getScaleForId(xid);
        meta.yScale = this.getScaleForId(yid);
        meta.rScale = this.getScaleForId(rid);
        meta.iScale = this.getScaleForId(iid);
        meta.vScale = this.getScaleForId(vid);
      }
      getDataset() {
        return this.chart.data.datasets[this.index];
      }
      getMeta() {
        return this.chart.getDatasetMeta(this.index);
      }
      getScaleForId(scaleID) {
        return this.chart.scales[scaleID];
      }
      _getOtherScale(scale) {
        const meta = this._cachedMeta;
        return scale === meta.iScale
          ? meta.vScale
          : meta.iScale;
      }
      reset() {
        this._update('reset');
      }
      _destroy() {
        const meta = this._cachedMeta;
        if (this._data) {
          unlistenArrayEvents(this._data, this);
        }
        if (meta._stacked) {
          clearStacks(meta);
        }
      }
      _dataCheck() {
        const dataset = this.getDataset();
        const data = dataset.data || (dataset.data = []);
        const _data = this._data;
        if (isObject(data)) {
          this._data = convertObjectDataToArray(data);
        } else if (_data !== data) {
          if (_data) {
            unlistenArrayEvents(_data, this);
            const meta = this._cachedMeta;
            clearStacks(meta);
            meta._parsed = [];
          }
          if (data && Object.isExtensible(data)) {
            listenArrayEvents(data, this);
          }
          this._syncList = [];
          this._data = data;
        }
      }
      addElements() {
        const meta = this._cachedMeta;
        this._dataCheck();
        if (this.datasetElementType) {
          meta.dataset = new this.datasetElementType();
        }
      }
      buildOrUpdateElements(resetNewElements) {
        const meta = this._cachedMeta;
        const dataset = this.getDataset();
        let stackChanged = false;
        this._dataCheck();
        const oldStacked = meta._stacked;
        meta._stacked = isStacked(meta.vScale, meta);
        if (meta.stack !== dataset.stack) {
          stackChanged = true;
          clearStacks(meta);
          meta.stack = dataset.stack;
        }
        this._resyncElements(resetNewElements);
        if (stackChanged || oldStacked !== meta._stacked) {
          updateStacks(this, meta._parsed);
        }
      }
      configure() {
        const config = this.chart.config;
        const scopeKeys = config.datasetScopeKeys(this._type);
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys, true);
        this.options = config.createResolver(scopes, this.getContext());
        this._parsing = this.options.parsing;
        this._cachedDataOpts = {};
      }
      parse(start, count) {
        const {_cachedMeta: meta, _data: data} = this;
        const {iScale, _stacked} = meta;
        const iAxis = iScale.axis;
        let sorted = start === 0 && count === data.length ? true : meta._sorted;
        let prev = start > 0 && meta._parsed[start - 1];
        let i, cur, parsed;
        if (this._parsing === false) {
          meta._parsed = data;
          meta._sorted = true;
          parsed = data;
        } else {
          if (isArray(data[start])) {
            parsed = this.parseArrayData(meta, data, start, count);
          } else if (isObject(data[start])) {
            parsed = this.parseObjectData(meta, data, start, count);
          } else {
            parsed = this.parsePrimitiveData(meta, data, start, count);
          }
          const isNotInOrderComparedToPrev = () => cur[iAxis] === null || (prev && cur[iAxis] < prev[iAxis]);
          for (i = 0; i < count; ++i) {
            meta._parsed[i + start] = cur = parsed[i];
            if (sorted) {
              if (isNotInOrderComparedToPrev()) {
                sorted = false;
              }
              prev = cur;
            }
          }
          meta._sorted = sorted;
        }
        if (_stacked) {
          updateStacks(this, parsed);
        }
      }
      parsePrimitiveData(meta, data, start, count) {
        const {iScale, vScale} = meta;
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const labels = iScale.getLabels();
        const singleScale = iScale === vScale;
        const parsed = new Array(count);
        let i, ilen, index;
        for (i = 0, ilen = count; i < ilen; ++i) {
          index = i + start;
          parsed[i] = {
            [iAxis]: singleScale || iScale.parse(labels[index], index),
            [vAxis]: vScale.parse(data[index], index)
          };
        }
        return parsed;
      }
      parseArrayData(meta, data, start, count) {
        const {xScale, yScale} = meta;
        const parsed = new Array(count);
        let i, ilen, index, item;
        for (i = 0, ilen = count; i < ilen; ++i) {
          index = i + start;
          item = data[index];
          parsed[i] = {
            x: xScale.parse(item[0], index),
            y: yScale.parse(item[1], index)
          };
        }
        return parsed;
      }
      parseObjectData(meta, data, start, count) {
        const {xScale, yScale} = meta;
        const {xAxisKey = 'x', yAxisKey = 'y'} = this._parsing;
        const parsed = new Array(count);
        let i, ilen, index, item;
        for (i = 0, ilen = count; i < ilen; ++i) {
          index = i + start;
          item = data[index];
          parsed[i] = {
            x: xScale.parse(resolveObjectKey(item, xAxisKey), index),
            y: yScale.parse(resolveObjectKey(item, yAxisKey), index)
          };
        }
        return parsed;
      }
      getParsed(index) {
        return this._cachedMeta._parsed[index];
      }
      getDataElement(index) {
        return this._cachedMeta.data[index];
      }
      applyStack(scale, parsed, mode) {
        const chart = this.chart;
        const meta = this._cachedMeta;
        const value = parsed[scale.axis];
        const stack = {
          keys: getSortedDatasetIndices(chart, true),
          values: parsed._stacks[scale.axis]
        };
        return applyStack(stack, value, meta.index, {mode});
      }
      updateRangeFromParsed(range, scale, parsed, stack) {
        const parsedValue = parsed[scale.axis];
        let value = parsedValue === null ? NaN : parsedValue;
        const values = stack && parsed._stacks[scale.axis];
        if (stack && values) {
          stack.values = values;
          value = applyStack(stack, parsedValue, this._cachedMeta.index);
        }
        range.min = Math.min(range.min, value);
        range.max = Math.max(range.max, value);
      }
      getMinMax(scale, canStack) {
        const meta = this._cachedMeta;
        const _parsed = meta._parsed;
        const sorted = meta._sorted && scale === meta.iScale;
        const ilen = _parsed.length;
        const otherScale = this._getOtherScale(scale);
        const stack = createStack(canStack, meta, this.chart);
        const range = {min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY};
        const {min: otherMin, max: otherMax} = getUserBounds(otherScale);
        let i, parsed;
        function _skip() {
          parsed = _parsed[i];
          const otherValue = parsed[otherScale.axis];
          return !isNumberFinite(parsed[scale.axis]) || otherMin > otherValue || otherMax < otherValue;
        }
        for (i = 0; i < ilen; ++i) {
          if (_skip()) {
            continue;
          }
          this.updateRangeFromParsed(range, scale, parsed, stack);
          if (sorted) {
            break;
          }
        }
        if (sorted) {
          for (i = ilen - 1; i >= 0; --i) {
            if (_skip()) {
              continue;
            }
            this.updateRangeFromParsed(range, scale, parsed, stack);
            break;
          }
        }
        return range;
      }
      getAllParsedValues(scale) {
        const parsed = this._cachedMeta._parsed;
        const values = [];
        let i, ilen, value;
        for (i = 0, ilen = parsed.length; i < ilen; ++i) {
          value = parsed[i][scale.axis];
          if (isNumberFinite(value)) {
            values.push(value);
          }
        }
        return values;
      }
      getMaxOverflow() {
        return false;
      }
      getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const iScale = meta.iScale;
        const vScale = meta.vScale;
        const parsed = this.getParsed(index);
        return {
          label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
          value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
        };
      }
      _update(mode) {
        const meta = this._cachedMeta;
        this.update(mode || 'default');
        meta._clip = toClip(valueOrDefault(this.options.clip, defaultClip(meta.xScale, meta.yScale, this.getMaxOverflow())));
      }
      update(mode) {}
      draw() {
        const ctx = this._ctx;
        const chart = this.chart;
        const meta = this._cachedMeta;
        const elements = meta.data || [];
        const area = chart.chartArea;
        const active = [];
        const start = this._drawStart || 0;
        const count = this._drawCount || (elements.length - start);
        const drawActiveElementsOnTop = this.options.drawActiveElementsOnTop;
        let i;
        if (meta.dataset) {
          meta.dataset.draw(ctx, area, start, count);
        }
        for (i = start; i < start + count; ++i) {
          const element = elements[i];
          if (element.hidden) {
            continue;
          }
          if (element.active && drawActiveElementsOnTop) {
            active.push(element);
          } else {
            element.draw(ctx, area);
          }
        }
        for (i = 0; i < active.length; ++i) {
          active[i].draw(ctx, area);
        }
      }
      getStyle(index, active) {
        const mode = active ? 'active' : 'default';
        return index === undefined && this._cachedMeta.dataset
          ? this.resolveDatasetElementOptions(mode)
          : this.resolveDataElementOptions(index || 0, mode);
      }
      getContext(index, active, mode) {
        const dataset = this.getDataset();
        let context;
        if (index >= 0 && index < this._cachedMeta.data.length) {
          const element = this._cachedMeta.data[index];
          context = element.$context ||
            (element.$context = createDataContext(this.getContext(), index, element));
          context.parsed = this.getParsed(index);
          context.raw = dataset.data[index];
          context.index = context.dataIndex = index;
        } else {
          context = this.$context ||
            (this.$context = createDatasetContext(this.chart.getContext(), this.index));
          context.dataset = dataset;
          context.index = context.datasetIndex = this.index;
        }
        context.active = !!active;
        context.mode = mode;
        return context;
      }
      resolveDatasetElementOptions(mode) {
        return this._resolveElementOptions(this.datasetElementType.id, mode);
      }
      resolveDataElementOptions(index, mode) {
        return this._resolveElementOptions(this.dataElementType.id, mode, index);
      }
      _resolveElementOptions(elementType, mode = 'default', index) {
        const active = mode === 'active';
        const cache = this._cachedDataOpts;
        const cacheKey = elementType + '-' + mode;
        const cached = cache[cacheKey];
        const sharing = this.enableOptionSharing && defined(index);
        if (cached) {
          return cloneIfNotShared(cached, sharing);
        }
        const config = this.chart.config;
        const scopeKeys = config.datasetElementScopeKeys(this._type, elementType);
        const prefixes = active ? [`${elementType}Hover`, 'hover', elementType, ''] : [elementType, ''];
        const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
        const names = Object.keys(defaults.elements[elementType]);
        const context = () => this.getContext(index, active);
        const values = config.resolveNamedOptions(scopes, names, context, prefixes);
        if (values.$shared) {
          values.$shared = sharing;
          cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
        }
        return values;
      }
      _resolveAnimations(index, transition, active) {
        const chart = this.chart;
        const cache = this._cachedDataOpts;
        const cacheKey = `animation-${transition}`;
        const cached = cache[cacheKey];
        if (cached) {
          return cached;
        }
        let options;
        if (chart.options.animation !== false) {
          const config = this.chart.config;
          const scopeKeys = config.datasetAnimationScopeKeys(this._type, transition);
          const scopes = config.getOptionScopes(this.getDataset(), scopeKeys);
          options = config.createResolver(scopes, this.getContext(index, active, transition));
        }
        const animations = new Animations(chart, options && options.animations);
        if (options && options._cacheable) {
          cache[cacheKey] = Object.freeze(animations);
        }
        return animations;
      }
      getSharedOptions(options) {
        if (!options.$shared) {
          return;
        }
        return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
      }
      includeOptions(mode, sharedOptions) {
        return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
      }
      updateElement(element, index, properties, mode) {
        if (isDirectUpdateMode(mode)) {
          Object.assign(element, properties);
        } else {
          this._resolveAnimations(index, mode).update(element, properties);
        }
      }
      updateSharedOptions(sharedOptions, mode, newOptions) {
        if (sharedOptions && !isDirectUpdateMode(mode)) {
          this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
        }
      }
      _setStyle(element, index, mode, active) {
        element.active = active;
        const options = this.getStyle(index, active);
        this._resolveAnimations(index, mode, active).update(element, {
          options: (!active && this.getSharedOptions(options)) || options
        });
      }
      removeHoverStyle(element, datasetIndex, index) {
        this._setStyle(element, index, 'active', false);
      }
      setHoverStyle(element, datasetIndex, index) {
        this._setStyle(element, index, 'active', true);
      }
      _removeDatasetHoverStyle() {
        const element = this._cachedMeta.dataset;
        if (element) {
          this._setStyle(element, undefined, 'active', false);
        }
      }
      _setDatasetHoverStyle() {
        const element = this._cachedMeta.dataset;
        if (element) {
          this._setStyle(element, undefined, 'active', true);
        }
      }
      _resyncElements(resetNewElements) {
        const data = this._data;
        const elements = this._cachedMeta.data;
        for (const [method, arg1, arg2] of this._syncList) {
          this[method](arg1, arg2);
        }
        this._syncList = [];
        const numMeta = elements.length;
        const numData = data.length;
        const count = Math.min(numData, numMeta);
        if (count) {
          this.parse(0, count);
        }
        if (numData > numMeta) {
          this._insertElements(numMeta, numData - numMeta, resetNewElements);
        } else if (numData < numMeta) {
          this._removeElements(numData, numMeta - numData);
        }
      }
      _insertElements(start, count, resetNewElements = true) {
        const meta = this._cachedMeta;
        const data = meta.data;
        const end = start + count;
        let i;
        const move = (arr) => {
          arr.length += count;
          for (i = arr.length - 1; i >= end; i--) {
            arr[i] = arr[i - count];
          }
        };
        move(data);
        for (i = start; i < end; ++i) {
          data[i] = new this.dataElementType();
        }
        if (this._parsing) {
          move(meta._parsed);
        }
        this.parse(start, count);
        if (resetNewElements) {
          this.updateElements(data, start, count, 'reset');
        }
      }
      updateElements(element, start, count, mode) {}
      _removeElements(start, count) {
        const meta = this._cachedMeta;
        if (this._parsing) {
          const removed = meta._parsed.splice(start, count);
          if (meta._stacked) {
            clearStacks(meta, removed);
          }
        }
        meta.data.splice(start, count);
      }
      _sync(args) {
        if (this._parsing) {
          this._syncList.push(args);
        } else {
          const [method, arg1, arg2] = args;
          this[method](arg1, arg2);
        }
        this.chart._dataChanges.push([this.index, ...args]);
      }
      _onDataPush() {
        const count = arguments.length;
        this._sync(['_insertElements', this.getDataset().data.length - count, count]);
      }
      _onDataPop() {
        this._sync(['_removeElements', this._cachedMeta.data.length - 1, 1]);
      }
      _onDataShift() {
        this._sync(['_removeElements', 0, 1]);
      }
      _onDataSplice(start, count) {
        if (count) {
          this._sync(['_removeElements', start, count]);
        }
        const newCount = arguments.length - 2;
        if (newCount) {
          this._sync(['_insertElements', start, newCount]);
        }
      }
      _onDataUnshift() {
        this._sync(['_insertElements', 0, arguments.length]);
      }
    }
    DatasetController.defaults = {};
    DatasetController.prototype.datasetElementType = null;
    DatasetController.prototype.dataElementType = null;

    function getAllScaleValues(scale, type) {
      if (!scale._cache.$bar) {
        const visibleMetas = scale.getMatchingVisibleMetas(type);
        let values = [];
        for (let i = 0, ilen = visibleMetas.length; i < ilen; i++) {
          values = values.concat(visibleMetas[i].controller.getAllParsedValues(scale));
        }
        scale._cache.$bar = _arrayUnique(values.sort((a, b) => a - b));
      }
      return scale._cache.$bar;
    }
    function computeMinSampleSize(meta) {
      const scale = meta.iScale;
      const values = getAllScaleValues(scale, meta.type);
      let min = scale._length;
      let i, ilen, curr, prev;
      const updateMinAndPrev = () => {
        if (curr === 32767 || curr === -32768) {
          return;
        }
        if (defined(prev)) {
          min = Math.min(min, Math.abs(curr - prev) || min);
        }
        prev = curr;
      };
      for (i = 0, ilen = values.length; i < ilen; ++i) {
        curr = scale.getPixelForValue(values[i]);
        updateMinAndPrev();
      }
      prev = undefined;
      for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
        curr = scale.getPixelForTick(i);
        updateMinAndPrev();
      }
      return min;
    }
    function computeFitCategoryTraits(index, ruler, options, stackCount) {
      const thickness = options.barThickness;
      let size, ratio;
      if (isNullOrUndef(thickness)) {
        size = ruler.min * options.categoryPercentage;
        ratio = options.barPercentage;
      } else {
        size = thickness * stackCount;
        ratio = 1;
      }
      return {
        chunk: size / stackCount,
        ratio,
        start: ruler.pixels[index] - (size / 2)
      };
    }
    function computeFlexCategoryTraits(index, ruler, options, stackCount) {
      const pixels = ruler.pixels;
      const curr = pixels[index];
      let prev = index > 0 ? pixels[index - 1] : null;
      let next = index < pixels.length - 1 ? pixels[index + 1] : null;
      const percent = options.categoryPercentage;
      if (prev === null) {
        prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
      }
      if (next === null) {
        next = curr + curr - prev;
      }
      const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
      const size = Math.abs(next - prev) / 2 * percent;
      return {
        chunk: size / stackCount,
        ratio: options.barPercentage,
        start
      };
    }
    function parseFloatBar(entry, item, vScale, i) {
      const startValue = vScale.parse(entry[0], i);
      const endValue = vScale.parse(entry[1], i);
      const min = Math.min(startValue, endValue);
      const max = Math.max(startValue, endValue);
      let barStart = min;
      let barEnd = max;
      if (Math.abs(min) > Math.abs(max)) {
        barStart = max;
        barEnd = min;
      }
      item[vScale.axis] = barEnd;
      item._custom = {
        barStart,
        barEnd,
        start: startValue,
        end: endValue,
        min,
        max
      };
    }
    function parseValue(entry, item, vScale, i) {
      if (isArray(entry)) {
        parseFloatBar(entry, item, vScale, i);
      } else {
        item[vScale.axis] = vScale.parse(entry, i);
      }
      return item;
    }
    function parseArrayOrPrimitive(meta, data, start, count) {
      const iScale = meta.iScale;
      const vScale = meta.vScale;
      const labels = iScale.getLabels();
      const singleScale = iScale === vScale;
      const parsed = [];
      let i, ilen, item, entry;
      for (i = start, ilen = start + count; i < ilen; ++i) {
        entry = data[i];
        item = {};
        item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
        parsed.push(parseValue(entry, item, vScale, i));
      }
      return parsed;
    }
    function isFloatBar(custom) {
      return custom && custom.barStart !== undefined && custom.barEnd !== undefined;
    }
    function barSign(size, vScale, actualBase) {
      if (size !== 0) {
        return sign(size);
      }
      return (vScale.isHorizontal() ? 1 : -1) * (vScale.min >= actualBase ? 1 : -1);
    }
    function borderProps(properties) {
      let reverse, start, end, top, bottom;
      if (properties.horizontal) {
        reverse = properties.base > properties.x;
        start = 'left';
        end = 'right';
      } else {
        reverse = properties.base < properties.y;
        start = 'bottom';
        end = 'top';
      }
      if (reverse) {
        top = 'end';
        bottom = 'start';
      } else {
        top = 'start';
        bottom = 'end';
      }
      return {start, end, reverse, top, bottom};
    }
    function setBorderSkipped(properties, options, stack, index) {
      let edge = options.borderSkipped;
      const res = {};
      if (!edge) {
        properties.borderSkipped = res;
        return;
      }
      const {start, end, reverse, top, bottom} = borderProps(properties);
      if (edge === 'middle' && stack) {
        properties.enableBorderRadius = true;
        if ((stack._top || 0) === index) {
          edge = top;
        } else if ((stack._bottom || 0) === index) {
          edge = bottom;
        } else {
          res[parseEdge(bottom, start, end, reverse)] = true;
          edge = top;
        }
      }
      res[parseEdge(edge, start, end, reverse)] = true;
      properties.borderSkipped = res;
    }
    function parseEdge(edge, a, b, reverse) {
      if (reverse) {
        edge = swap(edge, a, b);
        edge = startEnd(edge, b, a);
      } else {
        edge = startEnd(edge, a, b);
      }
      return edge;
    }
    function swap(orig, v1, v2) {
      return orig === v1 ? v2 : orig === v2 ? v1 : orig;
    }
    function startEnd(v, start, end) {
      return v === 'start' ? start : v === 'end' ? end : v;
    }
    function setInflateAmount(properties, {inflateAmount}, ratio) {
      properties.inflateAmount = inflateAmount === 'auto'
        ? ratio === 1 ? 0.33 : 0
        : inflateAmount;
    }
    class BarController extends DatasetController {
      parsePrimitiveData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count);
      }
      parseArrayData(meta, data, start, count) {
        return parseArrayOrPrimitive(meta, data, start, count);
      }
      parseObjectData(meta, data, start, count) {
        const {iScale, vScale} = meta;
        const {xAxisKey = 'x', yAxisKey = 'y'} = this._parsing;
        const iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey;
        const vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey;
        const parsed = [];
        let i, ilen, item, obj;
        for (i = start, ilen = start + count; i < ilen; ++i) {
          obj = data[i];
          item = {};
          item[iScale.axis] = iScale.parse(resolveObjectKey(obj, iAxisKey), i);
          parsed.push(parseValue(resolveObjectKey(obj, vAxisKey), item, vScale, i));
        }
        return parsed;
      }
      updateRangeFromParsed(range, scale, parsed, stack) {
        super.updateRangeFromParsed(range, scale, parsed, stack);
        const custom = parsed._custom;
        if (custom && scale === this._cachedMeta.vScale) {
          range.min = Math.min(range.min, custom.min);
          range.max = Math.max(range.max, custom.max);
        }
      }
      getMaxOverflow() {
        return 0;
      }
      getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const {iScale, vScale} = meta;
        const parsed = this.getParsed(index);
        const custom = parsed._custom;
        const value = isFloatBar(custom)
          ? '[' + custom.start + ', ' + custom.end + ']'
          : '' + vScale.getLabelForValue(parsed[vScale.axis]);
        return {
          label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
          value
        };
      }
      initialize() {
        this.enableOptionSharing = true;
        super.initialize();
        const meta = this._cachedMeta;
        meta.stack = this.getDataset().stack;
      }
      update(mode) {
        const meta = this._cachedMeta;
        this.updateElements(meta.data, 0, meta.data.length, mode);
      }
      updateElements(bars, start, count, mode) {
        const reset = mode === 'reset';
        const {index, _cachedMeta: {vScale}} = this;
        const base = vScale.getBasePixel();
        const horizontal = vScale.isHorizontal();
        const ruler = this._getRuler();
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
        for (let i = start; i < start + count; i++) {
          const parsed = this.getParsed(i);
          const vpixels = reset || isNullOrUndef(parsed[vScale.axis]) ? {base, head: base} : this._calculateBarValuePixels(i);
          const ipixels = this._calculateBarIndexPixels(i, ruler);
          const stack = (parsed._stacks || {})[vScale.axis];
          const properties = {
            horizontal,
            base: vpixels.base,
            enableBorderRadius: !stack || isFloatBar(parsed._custom) || (index === stack._top || index === stack._bottom),
            x: horizontal ? vpixels.head : ipixels.center,
            y: horizontal ? ipixels.center : vpixels.head,
            height: horizontal ? ipixels.size : Math.abs(vpixels.size),
            width: horizontal ? Math.abs(vpixels.size) : ipixels.size
          };
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i, bars[i].active ? 'active' : mode);
          }
          const options = properties.options || bars[i].options;
          setBorderSkipped(properties, options, stack, index);
          setInflateAmount(properties, options, ruler.ratio);
          this.updateElement(bars[i], i, properties, mode);
        }
      }
      _getStacks(last, dataIndex) {
        const meta = this._cachedMeta;
        const iScale = meta.iScale;
        const metasets = iScale.getMatchingVisibleMetas(this._type);
        const stacked = iScale.options.stacked;
        const ilen = metasets.length;
        const stacks = [];
        let i, item;
        for (i = 0; i < ilen; ++i) {
          item = metasets[i];
          if (!item.controller.options.grouped) {
            continue;
          }
          if (typeof dataIndex !== 'undefined') {
            const val = item.controller.getParsed(dataIndex)[
              item.controller._cachedMeta.vScale.axis
            ];
            if (isNullOrUndef(val) || isNaN(val)) {
              continue;
            }
          }
          if (stacked === false || stacks.indexOf(item.stack) === -1 ||
    				(stacked === undefined && item.stack === undefined)) {
            stacks.push(item.stack);
          }
          if (item.index === last) {
            break;
          }
        }
        if (!stacks.length) {
          stacks.push(undefined);
        }
        return stacks;
      }
      _getStackCount(index) {
        return this._getStacks(undefined, index).length;
      }
      _getStackIndex(datasetIndex, name, dataIndex) {
        const stacks = this._getStacks(datasetIndex, dataIndex);
        const index = (name !== undefined)
          ? stacks.indexOf(name)
          : -1;
        return (index === -1)
          ? stacks.length - 1
          : index;
      }
      _getRuler() {
        const opts = this.options;
        const meta = this._cachedMeta;
        const iScale = meta.iScale;
        const pixels = [];
        let i, ilen;
        for (i = 0, ilen = meta.data.length; i < ilen; ++i) {
          pixels.push(iScale.getPixelForValue(this.getParsed(i)[iScale.axis], i));
        }
        const barThickness = opts.barThickness;
        const min = barThickness || computeMinSampleSize(meta);
        return {
          min,
          pixels,
          start: iScale._startPixel,
          end: iScale._endPixel,
          stackCount: this._getStackCount(),
          scale: iScale,
          grouped: opts.grouped,
          ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
        };
      }
      _calculateBarValuePixels(index) {
        const {_cachedMeta: {vScale, _stacked}, options: {base: baseValue, minBarLength}} = this;
        const actualBase = baseValue || 0;
        const parsed = this.getParsed(index);
        const custom = parsed._custom;
        const floating = isFloatBar(custom);
        let value = parsed[vScale.axis];
        let start = 0;
        let length = _stacked ? this.applyStack(vScale, parsed, _stacked) : value;
        let head, size;
        if (length !== value) {
          start = length - value;
          length = value;
        }
        if (floating) {
          value = custom.barStart;
          length = custom.barEnd - custom.barStart;
          if (value !== 0 && sign(value) !== sign(custom.barEnd)) {
            start = 0;
          }
          start += value;
        }
        const startValue = !isNullOrUndef(baseValue) && !floating ? baseValue : start;
        let base = vScale.getPixelForValue(startValue);
        if (this.chart.getDataVisibility(index)) {
          head = vScale.getPixelForValue(start + length);
        } else {
          head = base;
        }
        size = head - base;
        if (Math.abs(size) < minBarLength) {
          size = barSign(size, vScale, actualBase) * minBarLength;
          if (value === actualBase) {
            base -= size / 2;
          }
          head = base + size;
        }
        if (base === vScale.getPixelForValue(actualBase)) {
          const halfGrid = sign(size) * vScale.getLineWidthForValue(actualBase) / 2;
          base += halfGrid;
          size -= halfGrid;
        }
        return {
          size,
          base,
          head,
          center: head + size / 2
        };
      }
      _calculateBarIndexPixels(index, ruler) {
        const scale = ruler.scale;
        const options = this.options;
        const skipNull = options.skipNull;
        const maxBarThickness = valueOrDefault(options.maxBarThickness, Infinity);
        let center, size;
        if (ruler.grouped) {
          const stackCount = skipNull ? this._getStackCount(index) : ruler.stackCount;
          const range = options.barThickness === 'flex'
            ? computeFlexCategoryTraits(index, ruler, options, stackCount)
            : computeFitCategoryTraits(index, ruler, options, stackCount);
          const stackIndex = this._getStackIndex(this.index, this._cachedMeta.stack, skipNull ? index : undefined);
          center = range.start + (range.chunk * stackIndex) + (range.chunk / 2);
          size = Math.min(maxBarThickness, range.chunk * range.ratio);
        } else {
          center = scale.getPixelForValue(this.getParsed(index)[scale.axis], index);
          size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
        }
        return {
          base: center - size / 2,
          head: center + size / 2,
          center,
          size
        };
      }
      draw() {
        const meta = this._cachedMeta;
        const vScale = meta.vScale;
        const rects = meta.data;
        const ilen = rects.length;
        let i = 0;
        for (; i < ilen; ++i) {
          if (this.getParsed(i)[vScale.axis] !== null) {
            rects[i].draw(this._ctx);
          }
        }
      }
    }
    BarController.id = 'bar';
    BarController.defaults = {
      datasetElementType: false,
      dataElementType: 'bar',
      categoryPercentage: 0.8,
      barPercentage: 0.9,
      grouped: true,
      animations: {
        numbers: {
          type: 'number',
          properties: ['x', 'y', 'base', 'width', 'height']
        }
      }
    };
    BarController.overrides = {
      scales: {
        _index_: {
          type: 'category',
          offset: true,
          grid: {
            offset: true
          }
        },
        _value_: {
          type: 'linear',
          beginAtZero: true,
        }
      }
    };

    class BubbleController extends DatasetController {
      initialize() {
        this.enableOptionSharing = true;
        super.initialize();
      }
      parsePrimitiveData(meta, data, start, count) {
        const parsed = super.parsePrimitiveData(meta, data, start, count);
        for (let i = 0; i < parsed.length; i++) {
          parsed[i]._custom = this.resolveDataElementOptions(i + start).radius;
        }
        return parsed;
      }
      parseArrayData(meta, data, start, count) {
        const parsed = super.parseArrayData(meta, data, start, count);
        for (let i = 0; i < parsed.length; i++) {
          const item = data[start + i];
          parsed[i]._custom = valueOrDefault(item[2], this.resolveDataElementOptions(i + start).radius);
        }
        return parsed;
      }
      parseObjectData(meta, data, start, count) {
        const parsed = super.parseObjectData(meta, data, start, count);
        for (let i = 0; i < parsed.length; i++) {
          const item = data[start + i];
          parsed[i]._custom = valueOrDefault(item && item.r && +item.r, this.resolveDataElementOptions(i + start).radius);
        }
        return parsed;
      }
      getMaxOverflow() {
        const data = this._cachedMeta.data;
        let max = 0;
        for (let i = data.length - 1; i >= 0; --i) {
          max = Math.max(max, data[i].size(this.resolveDataElementOptions(i)) / 2);
        }
        return max > 0 && max;
      }
      getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const {xScale, yScale} = meta;
        const parsed = this.getParsed(index);
        const x = xScale.getLabelForValue(parsed.x);
        const y = yScale.getLabelForValue(parsed.y);
        const r = parsed._custom;
        return {
          label: meta.label,
          value: '(' + x + ', ' + y + (r ? ', ' + r : '') + ')'
        };
      }
      update(mode) {
        const points = this._cachedMeta.data;
        this.updateElements(points, 0, points.length, mode);
      }
      updateElements(points, start, count, mode) {
        const reset = mode === 'reset';
        const {iScale, vScale} = this._cachedMeta;
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        for (let i = start; i < start + count; i++) {
          const point = points[i];
          const parsed = !reset && this.getParsed(i);
          const properties = {};
          const iPixel = properties[iAxis] = reset ? iScale.getPixelForDecimal(0.5) : iScale.getPixelForValue(parsed[iAxis]);
          const vPixel = properties[vAxis] = reset ? vScale.getBasePixel() : vScale.getPixelForValue(parsed[vAxis]);
          properties.skip = isNaN(iPixel) || isNaN(vPixel);
          if (includeOptions) {
            properties.options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
            if (reset) {
              properties.options.radius = 0;
            }
          }
          this.updateElement(point, i, properties, mode);
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
      }
      resolveDataElementOptions(index, mode) {
        const parsed = this.getParsed(index);
        let values = super.resolveDataElementOptions(index, mode);
        if (values.$shared) {
          values = Object.assign({}, values, {$shared: false});
        }
        const radius = values.radius;
        if (mode !== 'active') {
          values.radius = 0;
        }
        values.radius += valueOrDefault(parsed && parsed._custom, radius);
        return values;
      }
    }
    BubbleController.id = 'bubble';
    BubbleController.defaults = {
      datasetElementType: false,
      dataElementType: 'point',
      animations: {
        numbers: {
          type: 'number',
          properties: ['x', 'y', 'borderWidth', 'radius']
        }
      }
    };
    BubbleController.overrides = {
      scales: {
        x: {
          type: 'linear'
        },
        y: {
          type: 'linear'
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title() {
              return '';
            }
          }
        }
      }
    };

    function getRatioAndOffset(rotation, circumference, cutout) {
      let ratioX = 1;
      let ratioY = 1;
      let offsetX = 0;
      let offsetY = 0;
      if (circumference < TAU) {
        const startAngle = rotation;
        const endAngle = startAngle + circumference;
        const startX = Math.cos(startAngle);
        const startY = Math.sin(startAngle);
        const endX = Math.cos(endAngle);
        const endY = Math.sin(endAngle);
        const calcMax = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? 1 : Math.max(a, a * cutout, b, b * cutout);
        const calcMin = (angle, a, b) => _angleBetween(angle, startAngle, endAngle, true) ? -1 : Math.min(a, a * cutout, b, b * cutout);
        const maxX = calcMax(0, startX, endX);
        const maxY = calcMax(HALF_PI, startY, endY);
        const minX = calcMin(PI, startX, endX);
        const minY = calcMin(PI + HALF_PI, startY, endY);
        ratioX = (maxX - minX) / 2;
        ratioY = (maxY - minY) / 2;
        offsetX = -(maxX + minX) / 2;
        offsetY = -(maxY + minY) / 2;
      }
      return {ratioX, ratioY, offsetX, offsetY};
    }
    class DoughnutController extends DatasetController {
      constructor(chart, datasetIndex) {
        super(chart, datasetIndex);
        this.enableOptionSharing = true;
        this.innerRadius = undefined;
        this.outerRadius = undefined;
        this.offsetX = undefined;
        this.offsetY = undefined;
      }
      linkScales() {}
      parse(start, count) {
        const data = this.getDataset().data;
        const meta = this._cachedMeta;
        if (this._parsing === false) {
          meta._parsed = data;
        } else {
          let getter = (i) => +data[i];
          if (isObject(data[start])) {
            const {key = 'value'} = this._parsing;
            getter = (i) => +resolveObjectKey(data[i], key);
          }
          let i, ilen;
          for (i = start, ilen = start + count; i < ilen; ++i) {
            meta._parsed[i] = getter(i);
          }
        }
      }
      _getRotation() {
        return toRadians(this.options.rotation - 90);
      }
      _getCircumference() {
        return toRadians(this.options.circumference);
      }
      _getRotationExtents() {
        let min = TAU;
        let max = -TAU;
        for (let i = 0; i < this.chart.data.datasets.length; ++i) {
          if (this.chart.isDatasetVisible(i)) {
            const controller = this.chart.getDatasetMeta(i).controller;
            const rotation = controller._getRotation();
            const circumference = controller._getCircumference();
            min = Math.min(min, rotation);
            max = Math.max(max, rotation + circumference);
          }
        }
        return {
          rotation: min,
          circumference: max - min,
        };
      }
      update(mode) {
        const chart = this.chart;
        const {chartArea} = chart;
        const meta = this._cachedMeta;
        const arcs = meta.data;
        const spacing = this.getMaxBorderWidth() + this.getMaxOffset(arcs) + this.options.spacing;
        const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
        const cutout = Math.min(toPercentage(this.options.cutout, maxSize), 1);
        const chartWeight = this._getRingWeight(this.index);
        const {circumference, rotation} = this._getRotationExtents();
        const {ratioX, ratioY, offsetX, offsetY} = getRatioAndOffset(rotation, circumference, cutout);
        const maxWidth = (chartArea.width - spacing) / ratioX;
        const maxHeight = (chartArea.height - spacing) / ratioY;
        const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
        const outerRadius = toDimension(this.options.radius, maxRadius);
        const innerRadius = Math.max(outerRadius * cutout, 0);
        const radiusLength = (outerRadius - innerRadius) / this._getVisibleDatasetWeightTotal();
        this.offsetX = offsetX * outerRadius;
        this.offsetY = offsetY * outerRadius;
        meta.total = this.calculateTotal();
        this.outerRadius = outerRadius - radiusLength * this._getRingWeightOffset(this.index);
        this.innerRadius = Math.max(this.outerRadius - radiusLength * chartWeight, 0);
        this.updateElements(arcs, 0, arcs.length, mode);
      }
      _circumference(i, reset) {
        const opts = this.options;
        const meta = this._cachedMeta;
        const circumference = this._getCircumference();
        if ((reset && opts.animation.animateRotate) || !this.chart.getDataVisibility(i) || meta._parsed[i] === null || meta.data[i].hidden) {
          return 0;
        }
        return this.calculateCircumference(meta._parsed[i] * circumference / TAU);
      }
      updateElements(arcs, start, count, mode) {
        const reset = mode === 'reset';
        const chart = this.chart;
        const chartArea = chart.chartArea;
        const opts = chart.options;
        const animationOpts = opts.animation;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;
        const animateScale = reset && animationOpts.animateScale;
        const innerRadius = animateScale ? 0 : this.innerRadius;
        const outerRadius = animateScale ? 0 : this.outerRadius;
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        let startAngle = this._getRotation();
        let i;
        for (i = 0; i < start; ++i) {
          startAngle += this._circumference(i, reset);
        }
        for (i = start; i < start + count; ++i) {
          const circumference = this._circumference(i, reset);
          const arc = arcs[i];
          const properties = {
            x: centerX + this.offsetX,
            y: centerY + this.offsetY,
            startAngle,
            endAngle: startAngle + circumference,
            circumference,
            outerRadius,
            innerRadius
          };
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i, arc.active ? 'active' : mode);
          }
          startAngle += circumference;
          this.updateElement(arc, i, properties, mode);
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
      }
      calculateTotal() {
        const meta = this._cachedMeta;
        const metaData = meta.data;
        let total = 0;
        let i;
        for (i = 0; i < metaData.length; i++) {
          const value = meta._parsed[i];
          if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i) && !metaData[i].hidden) {
            total += Math.abs(value);
          }
        }
        return total;
      }
      calculateCircumference(value) {
        const total = this._cachedMeta.total;
        if (total > 0 && !isNaN(value)) {
          return TAU * (Math.abs(value) / total);
        }
        return 0;
      }
      getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const chart = this.chart;
        const labels = chart.data.labels || [];
        const value = formatNumber(meta._parsed[index], chart.options.locale);
        return {
          label: labels[index] || '',
          value,
        };
      }
      getMaxBorderWidth(arcs) {
        let max = 0;
        const chart = this.chart;
        let i, ilen, meta, controller, options;
        if (!arcs) {
          for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
            if (chart.isDatasetVisible(i)) {
              meta = chart.getDatasetMeta(i);
              arcs = meta.data;
              controller = meta.controller;
              break;
            }
          }
        }
        if (!arcs) {
          return 0;
        }
        for (i = 0, ilen = arcs.length; i < ilen; ++i) {
          options = controller.resolveDataElementOptions(i);
          if (options.borderAlign !== 'inner') {
            max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
          }
        }
        return max;
      }
      getMaxOffset(arcs) {
        let max = 0;
        for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
          const options = this.resolveDataElementOptions(i);
          max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
        }
        return max;
      }
      _getRingWeightOffset(datasetIndex) {
        let ringWeightOffset = 0;
        for (let i = 0; i < datasetIndex; ++i) {
          if (this.chart.isDatasetVisible(i)) {
            ringWeightOffset += this._getRingWeight(i);
          }
        }
        return ringWeightOffset;
      }
      _getRingWeight(datasetIndex) {
        return Math.max(valueOrDefault(this.chart.data.datasets[datasetIndex].weight, 1), 0);
      }
      _getVisibleDatasetWeightTotal() {
        return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
      }
    }
    DoughnutController.id = 'doughnut';
    DoughnutController.defaults = {
      datasetElementType: false,
      dataElementType: 'arc',
      animation: {
        animateRotate: true,
        animateScale: false
      },
      animations: {
        numbers: {
          type: 'number',
          properties: ['circumference', 'endAngle', 'innerRadius', 'outerRadius', 'startAngle', 'x', 'y', 'offset', 'borderWidth', 'spacing']
        },
      },
      cutout: '50%',
      rotation: 0,
      circumference: 360,
      radius: '100%',
      spacing: 0,
      indexAxis: 'r',
    };
    DoughnutController.descriptors = {
      _scriptable: (name) => name !== 'spacing',
      _indexable: (name) => name !== 'spacing',
    };
    DoughnutController.overrides = {
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            generateLabels(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                const {labels: {pointStyle}} = chart.legend.options;
                return data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i);
                  return {
                    text: label,
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    pointStyle: pointStyle,
                    hidden: !chart.getDataVisibility(i),
                    index: i
                  };
                });
              }
              return [];
            }
          },
          onClick(e, legendItem, legend) {
            legend.chart.toggleDataVisibility(legendItem.index);
            legend.chart.update();
          }
        },
        tooltip: {
          callbacks: {
            title() {
              return '';
            },
            label(tooltipItem) {
              let dataLabel = tooltipItem.label;
              const value = ': ' + tooltipItem.formattedValue;
              if (isArray(dataLabel)) {
                dataLabel = dataLabel.slice();
                dataLabel[0] += value;
              } else {
                dataLabel += value;
              }
              return dataLabel;
            }
          }
        }
      }
    };

    class LineController extends DatasetController {
      initialize() {
        this.enableOptionSharing = true;
        super.initialize();
      }
      update(mode) {
        const meta = this._cachedMeta;
        const {dataset: line, data: points = [], _dataset} = meta;
        const animationsDisabled = this.chart._animationsDisabled;
        let {start, count} = getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
        this._drawStart = start;
        this._drawCount = count;
        if (scaleRangesChanged(meta)) {
          start = 0;
          count = points.length;
        }
        line._chart = this.chart;
        line._datasetIndex = this.index;
        line._decimated = !!_dataset._decimated;
        line.points = points;
        const options = this.resolveDatasetElementOptions(mode);
        if (!this.options.showLine) {
          options.borderWidth = 0;
        }
        options.segment = this.options.segment;
        this.updateElement(line, undefined, {
          animated: !animationsDisabled,
          options
        }, mode);
        this.updateElements(points, start, count, mode);
      }
      updateElements(points, start, count, mode) {
        const reset = mode === 'reset';
        const {iScale, vScale, _stacked, _dataset} = this._cachedMeta;
        const firstOpts = this.resolveDataElementOptions(start, mode);
        const sharedOptions = this.getSharedOptions(firstOpts);
        const includeOptions = this.includeOptions(mode, sharedOptions);
        const iAxis = iScale.axis;
        const vAxis = vScale.axis;
        const {spanGaps, segment} = this.options;
        const maxGapLength = isNumber(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
        const directUpdate = this.chart._animationsDisabled || reset || mode === 'none';
        let prevParsed = start > 0 && this.getParsed(start - 1);
        for (let i = start; i < start + count; ++i) {
          const point = points[i];
          const parsed = this.getParsed(i);
          const properties = directUpdate ? point : {};
          const nullData = isNullOrUndef(parsed[vAxis]);
          const iPixel = properties[iAxis] = iScale.getPixelForValue(parsed[iAxis], i);
          const vPixel = properties[vAxis] = reset || nullData ? vScale.getBasePixel() : vScale.getPixelForValue(_stacked ? this.applyStack(vScale, parsed, _stacked) : parsed[vAxis], i);
          properties.skip = isNaN(iPixel) || isNaN(vPixel) || nullData;
          properties.stop = i > 0 && (parsed[iAxis] - prevParsed[iAxis]) > maxGapLength;
          if (segment) {
            properties.parsed = parsed;
            properties.raw = _dataset.data[i];
          }
          if (includeOptions) {
            properties.options = sharedOptions || this.resolveDataElementOptions(i, point.active ? 'active' : mode);
          }
          if (!directUpdate) {
            this.updateElement(point, i, properties, mode);
          }
          prevParsed = parsed;
        }
        this.updateSharedOptions(sharedOptions, mode, firstOpts);
      }
      getMaxOverflow() {
        const meta = this._cachedMeta;
        const dataset = meta.dataset;
        const border = dataset.options && dataset.options.borderWidth || 0;
        const data = meta.data || [];
        if (!data.length) {
          return border;
        }
        const firstPoint = data[0].size(this.resolveDataElementOptions(0));
        const lastPoint = data[data.length - 1].size(this.resolveDataElementOptions(data.length - 1));
        return Math.max(border, firstPoint, lastPoint) / 2;
      }
      draw() {
        const meta = this._cachedMeta;
        meta.dataset.updateControlPoints(this.chart.chartArea, meta.iScale.axis);
        super.draw();
      }
    }
    LineController.id = 'line';
    LineController.defaults = {
      datasetElementType: 'line',
      dataElementType: 'point',
      showLine: true,
      spanGaps: false,
    };
    LineController.overrides = {
      scales: {
        _index_: {
          type: 'category',
        },
        _value_: {
          type: 'linear',
        },
      }
    };
    function getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
      const pointCount = points.length;
      let start = 0;
      let count = pointCount;
      if (meta._sorted) {
        const {iScale, _parsed} = meta;
        const axis = iScale.axis;
        const {min, max, minDefined, maxDefined} = iScale.getUserBounds();
        if (minDefined) {
          start = _limitValue(Math.min(
            _lookupByKey(_parsed, iScale.axis, min).lo,
            animationsDisabled ? pointCount : _lookupByKey(points, axis, iScale.getPixelForValue(min)).lo),
          0, pointCount - 1);
        }
        if (maxDefined) {
          count = _limitValue(Math.max(
            _lookupByKey(_parsed, iScale.axis, max).hi + 1,
            animationsDisabled ? 0 : _lookupByKey(points, axis, iScale.getPixelForValue(max)).hi + 1),
          start, pointCount) - start;
        } else {
          count = pointCount - start;
        }
      }
      return {start, count};
    }
    function scaleRangesChanged(meta) {
      const {xScale, yScale, _scaleRanges} = meta;
      const newRanges = {
        xmin: xScale.min,
        xmax: xScale.max,
        ymin: yScale.min,
        ymax: yScale.max
      };
      if (!_scaleRanges) {
        meta._scaleRanges = newRanges;
        return true;
      }
      const changed = _scaleRanges.xmin !== xScale.min
    		|| _scaleRanges.xmax !== xScale.max
    		|| _scaleRanges.ymin !== yScale.min
    		|| _scaleRanges.ymax !== yScale.max;
      Object.assign(_scaleRanges, newRanges);
      return changed;
    }

    class PolarAreaController extends DatasetController {
      constructor(chart, datasetIndex) {
        super(chart, datasetIndex);
        this.innerRadius = undefined;
        this.outerRadius = undefined;
      }
      getLabelAndValue(index) {
        const meta = this._cachedMeta;
        const chart = this.chart;
        const labels = chart.data.labels || [];
        const value = formatNumber(meta._parsed[index].r, chart.options.locale);
        return {
          label: labels[index] || '',
          value,
        };
      }
      update(mode) {
        const arcs = this._cachedMeta.data;
        this._updateRadius();
        this.updateElements(arcs, 0, arcs.length, mode);
      }
      _updateRadius() {
        const chart = this.chart;
        const chartArea = chart.chartArea;
        const opts = chart.options;
        const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
        const outerRadius = Math.max(minSize / 2, 0);
        const innerRadius = Math.max(opts.cutoutPercentage ? (outerRadius / 100) * (opts.cutoutPercentage) : 1, 0);
        const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
        this.outerRadius = outerRadius - (radiusLength * this.index);
        this.innerRadius = this.outerRadius - radiusLength;
      }
      updateElements(arcs, start, count, mode) {
        const reset = mode === 'reset';
        const chart = this.chart;
        const dataset = this.getDataset();
        const opts = chart.options;
        const animationOpts = opts.animation;
        const scale = this._cachedMeta.rScale;
        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * PI;
        let angle = datasetStartAngle;
        let i;
        const defaultAngle = 360 / this.countVisibleElements();
        for (i = 0; i < start; ++i) {
          angle += this._computeAngle(i, mode, defaultAngle);
        }
        for (i = start; i < start + count; i++) {
          const arc = arcs[i];
          let startAngle = angle;
          let endAngle = angle + this._computeAngle(i, mode, defaultAngle);
          let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(dataset.data[i]) : 0;
          angle = endAngle;
          if (reset) {
            if (animationOpts.animateScale) {
              outerRadius = 0;
            }
            if (animationOpts.animateRotate) {
              startAngle = endAngle = datasetStartAngle;
            }
          }
          const properties = {
            x: centerX,
            y: centerY,
            innerRadius: 0,
            outerRadius,
            startAngle,
            endAngle,
            options: this.resolveDataElementOptions(i, arc.active ? 'active' : mode)
          };
          this.updateElement(arc, i, properties, mode);
        }
      }
      countVisibleElements() {
        const dataset = this.getDataset();
        const meta = this._cachedMeta;
        let count = 0;
        meta.data.forEach((element, index) => {
          if (!isNaN(dataset.data[index]) && this.chart.getDataVisibility(index)) {
            count++;
          }
        });
        return count;
      }
      _computeAngle(index, mode, defaultAngle) {
        return this.chart.getDataVisibility(index)
          ? toRadians(this.resolveDataElementOptions(index, mode).angle || defaultAngle)
          : 0;
      }
    }
    PolarAreaController.id = 'polarArea';
    PolarAreaController.defaults = {
      dataElementType: 'arc',
      animation: {
        animateRotate: true,
        animateScale: true
      },
      animations: {
        numbers: {
          type: 'number',
          properties: ['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius']
        },
      },
      indexAxis: 'r',
      startAngle: 0,
    };
    PolarAreaController.overrides = {
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            generateLabels(chart) {
              const data = chart.data;
              if (data.labels.length && data.datasets.length) {
                const {labels: {pointStyle}} = chart.legend.options;
                return data.labels.map((label, i) => {
                  const meta = chart.getDatasetMeta(0);
                  const style = meta.controller.getStyle(i);
                  return {
                    text: label,
                    fillStyle: style.backgroundColor,
                    strokeStyle: style.borderColor,
                    lineWidth: style.borderWidth,
                    pointStyle: pointStyle,
                    hidden: !chart.getDataVisibility(i),
                    index: i
                  };
                });
              }
              return [];
            }
          },
          onClick(e, legendItem, legend) {
            legend.chart.toggleDataVisibility(legendItem.index);
            legend.chart.update();
          }
        },
        tooltip: {
          callbacks: {
            title() {
              return '';
            },
            label(context) {
              return context.chart.data.labels[context.dataIndex] + ': ' + context.formattedValue;
            }
          }
        }
      },
      scales: {
        r: {
          type: 'radialLinear',
          angleLines: {
            display: false
          },
          beginAtZero: true,
          grid: {
            circular: true
          },
          pointLabels: {
            display: false
          },
          startAngle: 0
        }
      }
    };

    class PieController extends DoughnutController {
    }
    PieController.id = 'pie';
    PieController.defaults = {
      cutout: 0,
      rotation: 0,
      circumference: 360,
      radius: '100%'
    };

    class RadarController extends DatasetController {
      getLabelAndValue(index) {
        const vScale = this._cachedMeta.vScale;
        const parsed = this.getParsed(index);
        return {
          label: vScale.getLabels()[index],
          value: '' + vScale.getLabelForValue(parsed[vScale.axis])
        };
      }
      update(mode) {
        const meta = this._cachedMeta;
        const line = meta.dataset;
        const points = meta.data || [];
        const labels = meta.iScale.getLabels();
        line.points = points;
        if (mode !== 'resize') {
          const options = this.resolveDatasetElementOptions(mode);
          if (!this.options.showLine) {
            options.borderWidth = 0;
          }
          const properties = {
            _loop: true,
            _fullLoop: labels.length === points.length,
            options
          };
          this.updateElement(line, undefined, properties, mode);
        }
        this.updateElements(points, 0, points.length, mode);
      }
      updateElements(points, start, count, mode) {
        const dataset = this.getDataset();
        const scale = this._cachedMeta.rScale;
        const reset = mode === 'reset';
        for (let i = start; i < start + count; i++) {
          const point = points[i];
          const options = this.resolveDataElementOptions(i, point.active ? 'active' : mode);
          const pointPosition = scale.getPointPositionForValue(i, dataset.data[i]);
          const x = reset ? scale.xCenter : pointPosition.x;
          const y = reset ? scale.yCenter : pointPosition.y;
          const properties = {
            x,
            y,
            angle: pointPosition.angle,
            skip: isNaN(x) || isNaN(y),
            options
          };
          this.updateElement(point, i, properties, mode);
        }
      }
    }
    RadarController.id = 'radar';
    RadarController.defaults = {
      datasetElementType: 'line',
      dataElementType: 'point',
      indexAxis: 'r',
      showLine: true,
      elements: {
        line: {
          fill: 'start'
        }
      },
    };
    RadarController.overrides = {
      aspectRatio: 1,
      scales: {
        r: {
          type: 'radialLinear',
        }
      }
    };

    class ScatterController extends LineController {
    }
    ScatterController.id = 'scatter';
    ScatterController.defaults = {
      showLine: false,
      fill: false
    };
    ScatterController.overrides = {
      interaction: {
        mode: 'point'
      },
      plugins: {
        tooltip: {
          callbacks: {
            title() {
              return '';
            },
            label(item) {
              return '(' + item.label + ', ' + item.formattedValue + ')';
            }
          }
        }
      },
      scales: {
        x: {
          type: 'linear'
        },
        y: {
          type: 'linear'
        }
      }
    };

    function abstract() {
      throw new Error('This method is not implemented: Check that a complete date adapter is provided.');
    }
    class DateAdapter {
      constructor(options) {
        this.options = options || {};
      }
      formats() {
        return abstract();
      }
      parse(value, format) {
        return abstract();
      }
      format(timestamp, format) {
        return abstract();
      }
      add(timestamp, amount, unit) {
        return abstract();
      }
      diff(a, b, unit) {
        return abstract();
      }
      startOf(timestamp, unit, weekday) {
        return abstract();
      }
      endOf(timestamp, unit) {
        return abstract();
      }
    }
    DateAdapter.override = function(members) {
      Object.assign(DateAdapter.prototype, members);
    };
    var adapters = {
      _date: DateAdapter
    };

    function getRelativePosition(e, chart) {
      if ('native' in e) {
        return {
          x: e.x,
          y: e.y
        };
      }
      return getRelativePosition$1(e, chart);
    }
    function evaluateAllVisibleItems(chart, handler) {
      const metasets = chart.getSortedVisibleDatasetMetas();
      let index, data, element;
      for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
        ({index, data} = metasets[i]);
        for (let j = 0, jlen = data.length; j < jlen; ++j) {
          element = data[j];
          if (!element.skip) {
            handler(element, index, j);
          }
        }
      }
    }
    function binarySearch(metaset, axis, value, intersect) {
      const {controller, data, _sorted} = metaset;
      const iScale = controller._cachedMeta.iScale;
      if (iScale && axis === iScale.axis && axis !== 'r' && _sorted && data.length) {
        const lookupMethod = iScale._reversePixels ? _rlookupByKey : _lookupByKey;
        if (!intersect) {
          return lookupMethod(data, axis, value);
        } else if (controller._sharedOptions) {
          const el = data[0];
          const range = typeof el.getRange === 'function' && el.getRange(axis);
          if (range) {
            const start = lookupMethod(data, axis, value - range);
            const end = lookupMethod(data, axis, value + range);
            return {lo: start.lo, hi: end.hi};
          }
        }
      }
      return {lo: 0, hi: data.length - 1};
    }
    function optimizedEvaluateItems(chart, axis, position, handler, intersect) {
      const metasets = chart.getSortedVisibleDatasetMetas();
      const value = position[axis];
      for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
        const {index, data} = metasets[i];
        const {lo, hi} = binarySearch(metasets[i], axis, value, intersect);
        for (let j = lo; j <= hi; ++j) {
          const element = data[j];
          if (!element.skip) {
            handler(element, index, j);
          }
        }
      }
    }
    function getDistanceMetricForAxis(axis) {
      const useX = axis.indexOf('x') !== -1;
      const useY = axis.indexOf('y') !== -1;
      return function(pt1, pt2) {
        const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
        const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
      };
    }
    function getIntersectItems(chart, position, axis, useFinalPosition) {
      const items = [];
      if (!_isPointInArea(position, chart.chartArea, chart._minPadding)) {
        return items;
      }
      const evaluationFunc = function(element, datasetIndex, index) {
        if (element.inRange(position.x, position.y, useFinalPosition)) {
          items.push({element, datasetIndex, index});
        }
      };
      optimizedEvaluateItems(chart, axis, position, evaluationFunc, true);
      return items;
    }
    function getNearestRadialItems(chart, position, axis, useFinalPosition) {
      let items = [];
      function evaluationFunc(element, datasetIndex, index) {
        const {startAngle, endAngle} = element.getProps(['startAngle', 'endAngle'], useFinalPosition);
        const {angle} = getAngleFromPoint(element, {x: position.x, y: position.y});
        if (_angleBetween(angle, startAngle, endAngle)) {
          items.push({element, datasetIndex, index});
        }
      }
      optimizedEvaluateItems(chart, axis, position, evaluationFunc);
      return items;
    }
    function getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition) {
      let items = [];
      const distanceMetric = getDistanceMetricForAxis(axis);
      let minDistance = Number.POSITIVE_INFINITY;
      function evaluationFunc(element, datasetIndex, index) {
        const inRange = element.inRange(position.x, position.y, useFinalPosition);
        if (intersect && !inRange) {
          return;
        }
        const center = element.getCenterPoint(useFinalPosition);
        const pointInArea = _isPointInArea(center, chart.chartArea, chart._minPadding);
        if (!pointInArea && !inRange) {
          return;
        }
        const distance = distanceMetric(position, center);
        if (distance < minDistance) {
          items = [{element, datasetIndex, index}];
          minDistance = distance;
        } else if (distance === minDistance) {
          items.push({element, datasetIndex, index});
        }
      }
      optimizedEvaluateItems(chart, axis, position, evaluationFunc);
      return items;
    }
    function getNearestItems(chart, position, axis, intersect, useFinalPosition) {
      if (!_isPointInArea(position, chart.chartArea, chart._minPadding)) {
        return [];
      }
      return axis === 'r' && !intersect
        ? getNearestRadialItems(chart, position, axis, useFinalPosition)
        : getNearestCartesianItems(chart, position, axis, intersect, useFinalPosition);
    }
    function getAxisItems(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const items = [];
      const axis = options.axis;
      const rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
      let intersectsItem = false;
      evaluateAllVisibleItems(chart, (element, datasetIndex, index) => {
        if (element[rangeMethod](position[axis], useFinalPosition)) {
          items.push({element, datasetIndex, index});
        }
        if (element.inRange(position.x, position.y, useFinalPosition)) {
          intersectsItem = true;
        }
      });
      if (options.intersect && !intersectsItem) {
        return [];
      }
      return items;
    }
    var Interaction = {
      modes: {
        index(chart, e, options, useFinalPosition) {
          const position = getRelativePosition(e, chart);
          const axis = options.axis || 'x';
          const items = options.intersect
            ? getIntersectItems(chart, position, axis, useFinalPosition)
            : getNearestItems(chart, position, axis, false, useFinalPosition);
          const elements = [];
          if (!items.length) {
            return [];
          }
          chart.getSortedVisibleDatasetMetas().forEach((meta) => {
            const index = items[0].index;
            const element = meta.data[index];
            if (element && !element.skip) {
              elements.push({element, datasetIndex: meta.index, index});
            }
          });
          return elements;
        },
        dataset(chart, e, options, useFinalPosition) {
          const position = getRelativePosition(e, chart);
          const axis = options.axis || 'xy';
          let items = options.intersect
            ? getIntersectItems(chart, position, axis, useFinalPosition) :
            getNearestItems(chart, position, axis, false, useFinalPosition);
          if (items.length > 0) {
            const datasetIndex = items[0].datasetIndex;
            const data = chart.getDatasetMeta(datasetIndex).data;
            items = [];
            for (let i = 0; i < data.length; ++i) {
              items.push({element: data[i], datasetIndex, index: i});
            }
          }
          return items;
        },
        point(chart, e, options, useFinalPosition) {
          const position = getRelativePosition(e, chart);
          const axis = options.axis || 'xy';
          return getIntersectItems(chart, position, axis, useFinalPosition);
        },
        nearest(chart, e, options, useFinalPosition) {
          const position = getRelativePosition(e, chart);
          const axis = options.axis || 'xy';
          return getNearestItems(chart, position, axis, options.intersect, useFinalPosition);
        },
        x(chart, e, options, useFinalPosition) {
          return getAxisItems(chart, e, {axis: 'x', intersect: options.intersect}, useFinalPosition);
        },
        y(chart, e, options, useFinalPosition) {
          return getAxisItems(chart, e, {axis: 'y', intersect: options.intersect}, useFinalPosition);
        }
      }
    };

    const STATIC_POSITIONS = ['left', 'top', 'right', 'bottom'];
    function filterByPosition(array, position) {
      return array.filter(v => v.pos === position);
    }
    function filterDynamicPositionByAxis(array, axis) {
      return array.filter(v => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
    }
    function sortByWeight(array, reverse) {
      return array.sort((a, b) => {
        const v0 = reverse ? b : a;
        const v1 = reverse ? a : b;
        return v0.weight === v1.weight ?
          v0.index - v1.index :
          v0.weight - v1.weight;
      });
    }
    function wrapBoxes(boxes) {
      const layoutBoxes = [];
      let i, ilen, box, pos, stack, stackWeight;
      for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
        box = boxes[i];
        ({position: pos, options: {stack, stackWeight = 1}} = box);
        layoutBoxes.push({
          index: i,
          box,
          pos,
          horizontal: box.isHorizontal(),
          weight: box.weight,
          stack: stack && (pos + stack),
          stackWeight
        });
      }
      return layoutBoxes;
    }
    function buildStacks(layouts) {
      const stacks = {};
      for (const wrap of layouts) {
        const {stack, pos, stackWeight} = wrap;
        if (!stack || !STATIC_POSITIONS.includes(pos)) {
          continue;
        }
        const _stack = stacks[stack] || (stacks[stack] = {count: 0, placed: 0, weight: 0, size: 0});
        _stack.count++;
        _stack.weight += stackWeight;
      }
      return stacks;
    }
    function setLayoutDims(layouts, params) {
      const stacks = buildStacks(layouts);
      const {vBoxMaxWidth, hBoxMaxHeight} = params;
      let i, ilen, layout;
      for (i = 0, ilen = layouts.length; i < ilen; ++i) {
        layout = layouts[i];
        const {fullSize} = layout.box;
        const stack = stacks[layout.stack];
        const factor = stack && layout.stackWeight / stack.weight;
        if (layout.horizontal) {
          layout.width = factor ? factor * vBoxMaxWidth : fullSize && params.availableWidth;
          layout.height = hBoxMaxHeight;
        } else {
          layout.width = vBoxMaxWidth;
          layout.height = factor ? factor * hBoxMaxHeight : fullSize && params.availableHeight;
        }
      }
      return stacks;
    }
    function buildLayoutBoxes(boxes) {
      const layoutBoxes = wrapBoxes(boxes);
      const fullSize = sortByWeight(layoutBoxes.filter(wrap => wrap.box.fullSize), true);
      const left = sortByWeight(filterByPosition(layoutBoxes, 'left'), true);
      const right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
      const top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
      const bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
      const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x');
      const centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
      return {
        fullSize,
        leftAndTop: left.concat(top),
        rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
        chartArea: filterByPosition(layoutBoxes, 'chartArea'),
        vertical: left.concat(right).concat(centerVertical),
        horizontal: top.concat(bottom).concat(centerHorizontal)
      };
    }
    function getCombinedMax(maxPadding, chartArea, a, b) {
      return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
    }
    function updateMaxPadding(maxPadding, boxPadding) {
      maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
      maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
      maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
      maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
    }
    function updateDims(chartArea, params, layout, stacks) {
      const {pos, box} = layout;
      const maxPadding = chartArea.maxPadding;
      if (!isObject(pos)) {
        if (layout.size) {
          chartArea[pos] -= layout.size;
        }
        const stack = stacks[layout.stack] || {size: 0, count: 1};
        stack.size = Math.max(stack.size, layout.horizontal ? box.height : box.width);
        layout.size = stack.size / stack.count;
        chartArea[pos] += layout.size;
      }
      if (box.getPadding) {
        updateMaxPadding(maxPadding, box.getPadding());
      }
      const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
      const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
      const widthChanged = newWidth !== chartArea.w;
      const heightChanged = newHeight !== chartArea.h;
      chartArea.w = newWidth;
      chartArea.h = newHeight;
      return layout.horizontal
        ? {same: widthChanged, other: heightChanged}
        : {same: heightChanged, other: widthChanged};
    }
    function handleMaxPadding(chartArea) {
      const maxPadding = chartArea.maxPadding;
      function updatePos(pos) {
        const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
        chartArea[pos] += change;
        return change;
      }
      chartArea.y += updatePos('top');
      chartArea.x += updatePos('left');
      updatePos('right');
      updatePos('bottom');
    }
    function getMargins(horizontal, chartArea) {
      const maxPadding = chartArea.maxPadding;
      function marginForPositions(positions) {
        const margin = {left: 0, top: 0, right: 0, bottom: 0};
        positions.forEach((pos) => {
          margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
        });
        return margin;
      }
      return horizontal
        ? marginForPositions(['left', 'right'])
        : marginForPositions(['top', 'bottom']);
    }
    function fitBoxes(boxes, chartArea, params, stacks) {
      const refitBoxes = [];
      let i, ilen, layout, box, refit, changed;
      for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
        layout = boxes[i];
        box = layout.box;
        box.update(
          layout.width || chartArea.w,
          layout.height || chartArea.h,
          getMargins(layout.horizontal, chartArea)
        );
        const {same, other} = updateDims(chartArea, params, layout, stacks);
        refit |= same && refitBoxes.length;
        changed = changed || other;
        if (!box.fullSize) {
          refitBoxes.push(layout);
        }
      }
      return refit && fitBoxes(refitBoxes, chartArea, params, stacks) || changed;
    }
    function setBoxDims(box, left, top, width, height) {
      box.top = top;
      box.left = left;
      box.right = left + width;
      box.bottom = top + height;
      box.width = width;
      box.height = height;
    }
    function placeBoxes(boxes, chartArea, params, stacks) {
      const userPadding = params.padding;
      let {x, y} = chartArea;
      for (const layout of boxes) {
        const box = layout.box;
        const stack = stacks[layout.stack] || {count: 1, placed: 0, weight: 1};
        const weight = (layout.stackWeight / stack.weight) || 1;
        if (layout.horizontal) {
          const width = chartArea.w * weight;
          const height = stack.size || box.height;
          if (defined(stack.start)) {
            y = stack.start;
          }
          if (box.fullSize) {
            setBoxDims(box, userPadding.left, y, params.outerWidth - userPadding.right - userPadding.left, height);
          } else {
            setBoxDims(box, chartArea.left + stack.placed, y, width, height);
          }
          stack.start = y;
          stack.placed += width;
          y = box.bottom;
        } else {
          const height = chartArea.h * weight;
          const width = stack.size || box.width;
          if (defined(stack.start)) {
            x = stack.start;
          }
          if (box.fullSize) {
            setBoxDims(box, x, userPadding.top, width, params.outerHeight - userPadding.bottom - userPadding.top);
          } else {
            setBoxDims(box, x, chartArea.top + stack.placed, width, height);
          }
          stack.start = x;
          stack.placed += height;
          x = box.right;
        }
      }
      chartArea.x = x;
      chartArea.y = y;
    }
    defaults.set('layout', {
      autoPadding: true,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });
    var layouts = {
      addBox(chart, item) {
        if (!chart.boxes) {
          chart.boxes = [];
        }
        item.fullSize = item.fullSize || false;
        item.position = item.position || 'top';
        item.weight = item.weight || 0;
        item._layers = item._layers || function() {
          return [{
            z: 0,
            draw(chartArea) {
              item.draw(chartArea);
            }
          }];
        };
        chart.boxes.push(item);
      },
      removeBox(chart, layoutItem) {
        const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;
        if (index !== -1) {
          chart.boxes.splice(index, 1);
        }
      },
      configure(chart, item, options) {
        item.fullSize = options.fullSize;
        item.position = options.position;
        item.weight = options.weight;
      },
      update(chart, width, height, minPadding) {
        if (!chart) {
          return;
        }
        const padding = toPadding(chart.options.layout.padding);
        const availableWidth = Math.max(width - padding.width, 0);
        const availableHeight = Math.max(height - padding.height, 0);
        const boxes = buildLayoutBoxes(chart.boxes);
        const verticalBoxes = boxes.vertical;
        const horizontalBoxes = boxes.horizontal;
        each(chart.boxes, box => {
          if (typeof box.beforeLayout === 'function') {
            box.beforeLayout();
          }
        });
        const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) =>
          wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
        const params = Object.freeze({
          outerWidth: width,
          outerHeight: height,
          padding,
          availableWidth,
          availableHeight,
          vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
          hBoxMaxHeight: availableHeight / 2
        });
        const maxPadding = Object.assign({}, padding);
        updateMaxPadding(maxPadding, toPadding(minPadding));
        const chartArea = Object.assign({
          maxPadding,
          w: availableWidth,
          h: availableHeight,
          x: padding.left,
          y: padding.top
        }, padding);
        const stacks = setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
        fitBoxes(boxes.fullSize, chartArea, params, stacks);
        fitBoxes(verticalBoxes, chartArea, params, stacks);
        if (fitBoxes(horizontalBoxes, chartArea, params, stacks)) {
          fitBoxes(verticalBoxes, chartArea, params, stacks);
        }
        handleMaxPadding(chartArea);
        placeBoxes(boxes.leftAndTop, chartArea, params, stacks);
        chartArea.x += chartArea.w;
        chartArea.y += chartArea.h;
        placeBoxes(boxes.rightAndBottom, chartArea, params, stacks);
        chart.chartArea = {
          left: chartArea.left,
          top: chartArea.top,
          right: chartArea.left + chartArea.w,
          bottom: chartArea.top + chartArea.h,
          height: chartArea.h,
          width: chartArea.w,
        };
        each(boxes.chartArea, (layout) => {
          const box = layout.box;
          Object.assign(box, chart.chartArea);
          box.update(chartArea.w, chartArea.h, {left: 0, top: 0, right: 0, bottom: 0});
        });
      }
    };

    class BasePlatform {
      acquireContext(canvas, aspectRatio) {}
      releaseContext(context) {
        return false;
      }
      addEventListener(chart, type, listener) {}
      removeEventListener(chart, type, listener) {}
      getDevicePixelRatio() {
        return 1;
      }
      getMaximumSize(element, width, height, aspectRatio) {
        width = Math.max(0, width || element.width);
        height = height || element.height;
        return {
          width,
          height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
        };
      }
      isAttached(canvas) {
        return true;
      }
      updateConfig(config) {
      }
    }

    class BasicPlatform extends BasePlatform {
      acquireContext(item) {
        return item && item.getContext && item.getContext('2d') || null;
      }
      updateConfig(config) {
        config.options.animation = false;
      }
    }

    const EXPANDO_KEY = '$chartjs';
    const EVENT_TYPES = {
      touchstart: 'mousedown',
      touchmove: 'mousemove',
      touchend: 'mouseup',
      pointerenter: 'mouseenter',
      pointerdown: 'mousedown',
      pointermove: 'mousemove',
      pointerup: 'mouseup',
      pointerleave: 'mouseout',
      pointerout: 'mouseout'
    };
    const isNullOrEmpty = value => value === null || value === '';
    function initCanvas(canvas, aspectRatio) {
      const style = canvas.style;
      const renderHeight = canvas.getAttribute('height');
      const renderWidth = canvas.getAttribute('width');
      canvas[EXPANDO_KEY] = {
        initial: {
          height: renderHeight,
          width: renderWidth,
          style: {
            display: style.display,
            height: style.height,
            width: style.width
          }
        }
      };
      style.display = style.display || 'block';
      style.boxSizing = style.boxSizing || 'border-box';
      if (isNullOrEmpty(renderWidth)) {
        const displayWidth = readUsedSize(canvas, 'width');
        if (displayWidth !== undefined) {
          canvas.width = displayWidth;
        }
      }
      if (isNullOrEmpty(renderHeight)) {
        if (canvas.style.height === '') {
          canvas.height = canvas.width / (aspectRatio || 2);
        } else {
          const displayHeight = readUsedSize(canvas, 'height');
          if (displayHeight !== undefined) {
            canvas.height = displayHeight;
          }
        }
      }
      return canvas;
    }
    const eventListenerOptions = supportsEventListenerOptions ? {passive: true} : false;
    function addListener(node, type, listener) {
      node.addEventListener(type, listener, eventListenerOptions);
    }
    function removeListener(chart, type, listener) {
      chart.canvas.removeEventListener(type, listener, eventListenerOptions);
    }
    function fromNativeEvent(event, chart) {
      const type = EVENT_TYPES[event.type] || event.type;
      const {x, y} = getRelativePosition$1(event, chart);
      return {
        type,
        chart,
        native: event,
        x: x !== undefined ? x : null,
        y: y !== undefined ? y : null,
      };
    }
    function nodeListContains(nodeList, canvas) {
      for (const node of nodeList) {
        if (node === canvas || node.contains(canvas)) {
          return true;
        }
      }
    }
    function createAttachObserver(chart, type, listener) {
      const canvas = chart.canvas;
      const observer = new MutationObserver(entries => {
        let trigger = false;
        for (const entry of entries) {
          trigger = trigger || nodeListContains(entry.addedNodes, canvas);
          trigger = trigger && !nodeListContains(entry.removedNodes, canvas);
        }
        if (trigger) {
          listener();
        }
      });
      observer.observe(document, {childList: true, subtree: true});
      return observer;
    }
    function createDetachObserver(chart, type, listener) {
      const canvas = chart.canvas;
      const observer = new MutationObserver(entries => {
        let trigger = false;
        for (const entry of entries) {
          trigger = trigger || nodeListContains(entry.removedNodes, canvas);
          trigger = trigger && !nodeListContains(entry.addedNodes, canvas);
        }
        if (trigger) {
          listener();
        }
      });
      observer.observe(document, {childList: true, subtree: true});
      return observer;
    }
    const drpListeningCharts = new Map();
    let oldDevicePixelRatio = 0;
    function onWindowResize() {
      const dpr = window.devicePixelRatio;
      if (dpr === oldDevicePixelRatio) {
        return;
      }
      oldDevicePixelRatio = dpr;
      drpListeningCharts.forEach((resize, chart) => {
        if (chart.currentDevicePixelRatio !== dpr) {
          resize();
        }
      });
    }
    function listenDevicePixelRatioChanges(chart, resize) {
      if (!drpListeningCharts.size) {
        window.addEventListener('resize', onWindowResize);
      }
      drpListeningCharts.set(chart, resize);
    }
    function unlistenDevicePixelRatioChanges(chart) {
      drpListeningCharts.delete(chart);
      if (!drpListeningCharts.size) {
        window.removeEventListener('resize', onWindowResize);
      }
    }
    function createResizeObserver(chart, type, listener) {
      const canvas = chart.canvas;
      const container = canvas && _getParentNode(canvas);
      if (!container) {
        return;
      }
      const resize = throttled((width, height) => {
        const w = container.clientWidth;
        listener(width, height);
        if (w < container.clientWidth) {
          listener();
        }
      }, window);
      const observer = new ResizeObserver(entries => {
        const entry = entries[0];
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        if (width === 0 && height === 0) {
          return;
        }
        resize(width, height);
      });
      observer.observe(container);
      listenDevicePixelRatioChanges(chart, resize);
      return observer;
    }
    function releaseObserver(chart, type, observer) {
      if (observer) {
        observer.disconnect();
      }
      if (type === 'resize') {
        unlistenDevicePixelRatioChanges(chart);
      }
    }
    function createProxyAndListen(chart, type, listener) {
      const canvas = chart.canvas;
      const proxy = throttled((event) => {
        if (chart.ctx !== null) {
          listener(fromNativeEvent(event, chart));
        }
      }, chart, (args) => {
        const event = args[0];
        return [event, event.offsetX, event.offsetY];
      });
      addListener(canvas, type, proxy);
      return proxy;
    }
    class DomPlatform extends BasePlatform {
      acquireContext(canvas, aspectRatio) {
        const context = canvas && canvas.getContext && canvas.getContext('2d');
        if (context && context.canvas === canvas) {
          initCanvas(canvas, aspectRatio);
          return context;
        }
        return null;
      }
      releaseContext(context) {
        const canvas = context.canvas;
        if (!canvas[EXPANDO_KEY]) {
          return false;
        }
        const initial = canvas[EXPANDO_KEY].initial;
        ['height', 'width'].forEach((prop) => {
          const value = initial[prop];
          if (isNullOrUndef(value)) {
            canvas.removeAttribute(prop);
          } else {
            canvas.setAttribute(prop, value);
          }
        });
        const style = initial.style || {};
        Object.keys(style).forEach((key) => {
          canvas.style[key] = style[key];
        });
        canvas.width = canvas.width;
        delete canvas[EXPANDO_KEY];
        return true;
      }
      addEventListener(chart, type, listener) {
        this.removeEventListener(chart, type);
        const proxies = chart.$proxies || (chart.$proxies = {});
        const handlers = {
          attach: createAttachObserver,
          detach: createDetachObserver,
          resize: createResizeObserver
        };
        const handler = handlers[type] || createProxyAndListen;
        proxies[type] = handler(chart, type, listener);
      }
      removeEventListener(chart, type) {
        const proxies = chart.$proxies || (chart.$proxies = {});
        const proxy = proxies[type];
        if (!proxy) {
          return;
        }
        const handlers = {
          attach: releaseObserver,
          detach: releaseObserver,
          resize: releaseObserver
        };
        const handler = handlers[type] || removeListener;
        handler(chart, type, proxy);
        proxies[type] = undefined;
      }
      getDevicePixelRatio() {
        return window.devicePixelRatio;
      }
      getMaximumSize(canvas, width, height, aspectRatio) {
        return getMaximumSize(canvas, width, height, aspectRatio);
      }
      isAttached(canvas) {
        const container = _getParentNode(canvas);
        return !!(container && container.isConnected);
      }
    }

    function _detectPlatform(canvas) {
      if (!_isDomSupported() || (typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas)) {
        return BasicPlatform;
      }
      return DomPlatform;
    }

    class Element {
      constructor() {
        this.x = undefined;
        this.y = undefined;
        this.active = false;
        this.options = undefined;
        this.$animations = undefined;
      }
      tooltipPosition(useFinalPosition) {
        const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
        return {x, y};
      }
      hasValue() {
        return isNumber(this.x) && isNumber(this.y);
      }
      getProps(props, final) {
        const anims = this.$animations;
        if (!final || !anims) {
          return this;
        }
        const ret = {};
        props.forEach(prop => {
          ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : this[prop];
        });
        return ret;
      }
    }
    Element.defaults = {};
    Element.defaultRoutes = undefined;

    const formatters = {
      values(value) {
        return isArray(value) ? value : '' + value;
      },
      numeric(tickValue, index, ticks) {
        if (tickValue === 0) {
          return '0';
        }
        const locale = this.chart.options.locale;
        let notation;
        let delta = tickValue;
        if (ticks.length > 1) {
          const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));
          if (maxTick < 1e-4 || maxTick > 1e+15) {
            notation = 'scientific';
          }
          delta = calculateDelta(tickValue, ticks);
        }
        const logDelta = log10(Math.abs(delta));
        const numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
        const options = {notation, minimumFractionDigits: numDecimal, maximumFractionDigits: numDecimal};
        Object.assign(options, this.options.ticks.format);
        return formatNumber(tickValue, locale, options);
      },
      logarithmic(tickValue, index, ticks) {
        if (tickValue === 0) {
          return '0';
        }
        const remain = tickValue / (Math.pow(10, Math.floor(log10(tickValue))));
        if (remain === 1 || remain === 2 || remain === 5) {
          return formatters.numeric.call(this, tickValue, index, ticks);
        }
        return '';
      }
    };
    function calculateDelta(tickValue, ticks) {
      let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;
      if (Math.abs(delta) >= 1 && tickValue !== Math.floor(tickValue)) {
        delta = tickValue - Math.floor(tickValue);
      }
      return delta;
    }
    var Ticks = {formatters};

    defaults.set('scale', {
      display: true,
      offset: false,
      reverse: false,
      beginAtZero: false,
      bounds: 'ticks',
      grace: 0,
      grid: {
        display: true,
        lineWidth: 1,
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
        tickLength: 8,
        tickWidth: (_ctx, options) => options.lineWidth,
        tickColor: (_ctx, options) => options.color,
        offset: false,
        borderDash: [],
        borderDashOffset: 0.0,
        borderWidth: 1
      },
      title: {
        display: false,
        text: '',
        padding: {
          top: 4,
          bottom: 4
        }
      },
      ticks: {
        minRotation: 0,
        maxRotation: 50,
        mirror: false,
        textStrokeWidth: 0,
        textStrokeColor: '',
        padding: 3,
        display: true,
        autoSkip: true,
        autoSkipPadding: 3,
        labelOffset: 0,
        callback: Ticks.formatters.values,
        minor: {},
        major: {},
        align: 'center',
        crossAlign: 'near',
        showLabelBackdrop: false,
        backdropColor: 'rgba(255, 255, 255, 0.75)',
        backdropPadding: 2,
      }
    });
    defaults.route('scale.ticks', 'color', '', 'color');
    defaults.route('scale.grid', 'color', '', 'borderColor');
    defaults.route('scale.grid', 'borderColor', '', 'borderColor');
    defaults.route('scale.title', 'color', '', 'color');
    defaults.describe('scale', {
      _fallback: false,
      _scriptable: (name) => !name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser',
      _indexable: (name) => name !== 'borderDash' && name !== 'tickBorderDash',
    });
    defaults.describe('scales', {
      _fallback: 'scale',
    });
    defaults.describe('scale.ticks', {
      _scriptable: (name) => name !== 'backdropPadding' && name !== 'callback',
      _indexable: (name) => name !== 'backdropPadding',
    });

    function autoSkip(scale, ticks) {
      const tickOpts = scale.options.ticks;
      const ticksLimit = tickOpts.maxTicksLimit || determineMaxTicks(scale);
      const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
      const numMajorIndices = majorIndices.length;
      const first = majorIndices[0];
      const last = majorIndices[numMajorIndices - 1];
      const newTicks = [];
      if (numMajorIndices > ticksLimit) {
        skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
        return newTicks;
      }
      const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);
      if (numMajorIndices > 0) {
        let i, ilen;
        const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
        skip(ticks, newTicks, spacing, isNullOrUndef(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);
        for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
          skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
        }
        skip(ticks, newTicks, spacing, last, isNullOrUndef(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
        return newTicks;
      }
      skip(ticks, newTicks, spacing);
      return newTicks;
    }
    function determineMaxTicks(scale) {
      const offset = scale.options.offset;
      const tickLength = scale._tickSize();
      const maxScale = scale._length / tickLength + (offset ? 0 : 1);
      const maxChart = scale._maxLength / tickLength;
      return Math.floor(Math.min(maxScale, maxChart));
    }
    function calculateSpacing(majorIndices, ticks, ticksLimit) {
      const evenMajorSpacing = getEvenSpacing(majorIndices);
      const spacing = ticks.length / ticksLimit;
      if (!evenMajorSpacing) {
        return Math.max(spacing, 1);
      }
      const factors = _factorize(evenMajorSpacing);
      for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
        const factor = factors[i];
        if (factor > spacing) {
          return factor;
        }
      }
      return Math.max(spacing, 1);
    }
    function getMajorIndices(ticks) {
      const result = [];
      let i, ilen;
      for (i = 0, ilen = ticks.length; i < ilen; i++) {
        if (ticks[i].major) {
          result.push(i);
        }
      }
      return result;
    }
    function skipMajors(ticks, newTicks, majorIndices, spacing) {
      let count = 0;
      let next = majorIndices[0];
      let i;
      spacing = Math.ceil(spacing);
      for (i = 0; i < ticks.length; i++) {
        if (i === next) {
          newTicks.push(ticks[i]);
          count++;
          next = majorIndices[count * spacing];
        }
      }
    }
    function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
      const start = valueOrDefault(majorStart, 0);
      const end = Math.min(valueOrDefault(majorEnd, ticks.length), ticks.length);
      let count = 0;
      let length, i, next;
      spacing = Math.ceil(spacing);
      if (majorEnd) {
        length = majorEnd - majorStart;
        spacing = length / Math.floor(length / spacing);
      }
      next = start;
      while (next < 0) {
        count++;
        next = Math.round(start + count * spacing);
      }
      for (i = Math.max(start, 0); i < end; i++) {
        if (i === next) {
          newTicks.push(ticks[i]);
          count++;
          next = Math.round(start + count * spacing);
        }
      }
    }
    function getEvenSpacing(arr) {
      const len = arr.length;
      let i, diff;
      if (len < 2) {
        return false;
      }
      for (diff = arr[0], i = 1; i < len; ++i) {
        if (arr[i] - arr[i - 1] !== diff) {
          return false;
        }
      }
      return diff;
    }

    const reverseAlign = (align) => align === 'left' ? 'right' : align === 'right' ? 'left' : align;
    const offsetFromEdge = (scale, edge, offset) => edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;
    function sample(arr, numItems) {
      const result = [];
      const increment = arr.length / numItems;
      const len = arr.length;
      let i = 0;
      for (; i < len; i += increment) {
        result.push(arr[Math.floor(i)]);
      }
      return result;
    }
    function getPixelForGridLine(scale, index, offsetGridLines) {
      const length = scale.ticks.length;
      const validIndex = Math.min(index, length - 1);
      const start = scale._startPixel;
      const end = scale._endPixel;
      const epsilon = 1e-6;
      let lineValue = scale.getPixelForTick(validIndex);
      let offset;
      if (offsetGridLines) {
        if (length === 1) {
          offset = Math.max(lineValue - start, end - lineValue);
        } else if (index === 0) {
          offset = (scale.getPixelForTick(1) - lineValue) / 2;
        } else {
          offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
        }
        lineValue += validIndex < index ? offset : -offset;
        if (lineValue < start - epsilon || lineValue > end + epsilon) {
          return;
        }
      }
      return lineValue;
    }
    function garbageCollect(caches, length) {
      each(caches, (cache) => {
        const gc = cache.gc;
        const gcLen = gc.length / 2;
        let i;
        if (gcLen > length) {
          for (i = 0; i < gcLen; ++i) {
            delete cache.data[gc[i]];
          }
          gc.splice(0, gcLen);
        }
      });
    }
    function getTickMarkLength(options) {
      return options.drawTicks ? options.tickLength : 0;
    }
    function getTitleHeight(options, fallback) {
      if (!options.display) {
        return 0;
      }
      const font = toFont(options.font, fallback);
      const padding = toPadding(options.padding);
      const lines = isArray(options.text) ? options.text.length : 1;
      return (lines * font.lineHeight) + padding.height;
    }
    function createScaleContext(parent, scale) {
      return createContext(parent, {
        scale,
        type: 'scale'
      });
    }
    function createTickContext(parent, index, tick) {
      return createContext(parent, {
        tick,
        index,
        type: 'tick'
      });
    }
    function titleAlign(align, position, reverse) {
      let ret = _toLeftRightCenter(align);
      if ((reverse && position !== 'right') || (!reverse && position === 'right')) {
        ret = reverseAlign(ret);
      }
      return ret;
    }
    function titleArgs(scale, offset, position, align) {
      const {top, left, bottom, right, chart} = scale;
      const {chartArea, scales} = chart;
      let rotation = 0;
      let maxWidth, titleX, titleY;
      const height = bottom - top;
      const width = right - left;
      if (scale.isHorizontal()) {
        titleX = _alignStartEnd(align, left, right);
        if (isObject(position)) {
          const positionAxisID = Object.keys(position)[0];
          const value = position[positionAxisID];
          titleY = scales[positionAxisID].getPixelForValue(value) + height - offset;
        } else if (position === 'center') {
          titleY = (chartArea.bottom + chartArea.top) / 2 + height - offset;
        } else {
          titleY = offsetFromEdge(scale, position, offset);
        }
        maxWidth = right - left;
      } else {
        if (isObject(position)) {
          const positionAxisID = Object.keys(position)[0];
          const value = position[positionAxisID];
          titleX = scales[positionAxisID].getPixelForValue(value) - width + offset;
        } else if (position === 'center') {
          titleX = (chartArea.left + chartArea.right) / 2 - width + offset;
        } else {
          titleX = offsetFromEdge(scale, position, offset);
        }
        titleY = _alignStartEnd(align, bottom, top);
        rotation = position === 'left' ? -HALF_PI : HALF_PI;
      }
      return {titleX, titleY, maxWidth, rotation};
    }
    class Scale extends Element {
      constructor(cfg) {
        super();
        this.id = cfg.id;
        this.type = cfg.type;
        this.options = undefined;
        this.ctx = cfg.ctx;
        this.chart = cfg.chart;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.width = undefined;
        this.height = undefined;
        this._margins = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        };
        this.maxWidth = undefined;
        this.maxHeight = undefined;
        this.paddingTop = undefined;
        this.paddingBottom = undefined;
        this.paddingLeft = undefined;
        this.paddingRight = undefined;
        this.axis = undefined;
        this.labelRotation = undefined;
        this.min = undefined;
        this.max = undefined;
        this._range = undefined;
        this.ticks = [];
        this._gridLineItems = null;
        this._labelItems = null;
        this._labelSizes = null;
        this._length = 0;
        this._maxLength = 0;
        this._longestTextCache = {};
        this._startPixel = undefined;
        this._endPixel = undefined;
        this._reversePixels = false;
        this._userMax = undefined;
        this._userMin = undefined;
        this._suggestedMax = undefined;
        this._suggestedMin = undefined;
        this._ticksLength = 0;
        this._borderValue = 0;
        this._cache = {};
        this._dataLimitsCached = false;
        this.$context = undefined;
      }
      init(options) {
        this.options = options.setContext(this.getContext());
        this.axis = options.axis;
        this._userMin = this.parse(options.min);
        this._userMax = this.parse(options.max);
        this._suggestedMin = this.parse(options.suggestedMin);
        this._suggestedMax = this.parse(options.suggestedMax);
      }
      parse(raw, index) {
        return raw;
      }
      getUserBounds() {
        let {_userMin, _userMax, _suggestedMin, _suggestedMax} = this;
        _userMin = finiteOrDefault(_userMin, Number.POSITIVE_INFINITY);
        _userMax = finiteOrDefault(_userMax, Number.NEGATIVE_INFINITY);
        _suggestedMin = finiteOrDefault(_suggestedMin, Number.POSITIVE_INFINITY);
        _suggestedMax = finiteOrDefault(_suggestedMax, Number.NEGATIVE_INFINITY);
        return {
          min: finiteOrDefault(_userMin, _suggestedMin),
          max: finiteOrDefault(_userMax, _suggestedMax),
          minDefined: isNumberFinite(_userMin),
          maxDefined: isNumberFinite(_userMax)
        };
      }
      getMinMax(canStack) {
        let {min, max, minDefined, maxDefined} = this.getUserBounds();
        let range;
        if (minDefined && maxDefined) {
          return {min, max};
        }
        const metas = this.getMatchingVisibleMetas();
        for (let i = 0, ilen = metas.length; i < ilen; ++i) {
          range = metas[i].controller.getMinMax(this, canStack);
          if (!minDefined) {
            min = Math.min(min, range.min);
          }
          if (!maxDefined) {
            max = Math.max(max, range.max);
          }
        }
        min = maxDefined && min > max ? max : min;
        max = minDefined && min > max ? min : max;
        return {
          min: finiteOrDefault(min, finiteOrDefault(max, min)),
          max: finiteOrDefault(max, finiteOrDefault(min, max))
        };
      }
      getPadding() {
        return {
          left: this.paddingLeft || 0,
          top: this.paddingTop || 0,
          right: this.paddingRight || 0,
          bottom: this.paddingBottom || 0
        };
      }
      getTicks() {
        return this.ticks;
      }
      getLabels() {
        const data = this.chart.data;
        return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
      }
      beforeLayout() {
        this._cache = {};
        this._dataLimitsCached = false;
      }
      beforeUpdate() {
        callback(this.options.beforeUpdate, [this]);
      }
      update(maxWidth, maxHeight, margins) {
        const {beginAtZero, grace, ticks: tickOpts} = this.options;
        const sampleSize = tickOpts.sampleSize;
        this.beforeUpdate();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins = Object.assign({
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }, margins);
        this.ticks = null;
        this._labelSizes = null;
        this._gridLineItems = null;
        this._labelItems = null;
        this.beforeSetDimensions();
        this.setDimensions();
        this.afterSetDimensions();
        this._maxLength = this.isHorizontal()
          ? this.width + margins.left + margins.right
          : this.height + margins.top + margins.bottom;
        if (!this._dataLimitsCached) {
          this.beforeDataLimits();
          this.determineDataLimits();
          this.afterDataLimits();
          this._range = _addGrace(this, grace, beginAtZero);
          this._dataLimitsCached = true;
        }
        this.beforeBuildTicks();
        this.ticks = this.buildTicks() || [];
        this.afterBuildTicks();
        const samplingEnabled = sampleSize < this.ticks.length;
        this._convertTicksToLabels(samplingEnabled ? sample(this.ticks, sampleSize) : this.ticks);
        this.configure();
        this.beforeCalculateLabelRotation();
        this.calculateLabelRotation();
        this.afterCalculateLabelRotation();
        if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
          this.ticks = autoSkip(this, this.ticks);
          this._labelSizes = null;
        }
        if (samplingEnabled) {
          this._convertTicksToLabels(this.ticks);
        }
        this.beforeFit();
        this.fit();
        this.afterFit();
        this.afterUpdate();
      }
      configure() {
        let reversePixels = this.options.reverse;
        let startPixel, endPixel;
        if (this.isHorizontal()) {
          startPixel = this.left;
          endPixel = this.right;
        } else {
          startPixel = this.top;
          endPixel = this.bottom;
          reversePixels = !reversePixels;
        }
        this._startPixel = startPixel;
        this._endPixel = endPixel;
        this._reversePixels = reversePixels;
        this._length = endPixel - startPixel;
        this._alignToPixels = this.options.alignToPixels;
      }
      afterUpdate() {
        callback(this.options.afterUpdate, [this]);
      }
      beforeSetDimensions() {
        callback(this.options.beforeSetDimensions, [this]);
      }
      setDimensions() {
        if (this.isHorizontal()) {
          this.width = this.maxWidth;
          this.left = 0;
          this.right = this.width;
        } else {
          this.height = this.maxHeight;
          this.top = 0;
          this.bottom = this.height;
        }
        this.paddingLeft = 0;
        this.paddingTop = 0;
        this.paddingRight = 0;
        this.paddingBottom = 0;
      }
      afterSetDimensions() {
        callback(this.options.afterSetDimensions, [this]);
      }
      _callHooks(name) {
        this.chart.notifyPlugins(name, this.getContext());
        callback(this.options[name], [this]);
      }
      beforeDataLimits() {
        this._callHooks('beforeDataLimits');
      }
      determineDataLimits() {}
      afterDataLimits() {
        this._callHooks('afterDataLimits');
      }
      beforeBuildTicks() {
        this._callHooks('beforeBuildTicks');
      }
      buildTicks() {
        return [];
      }
      afterBuildTicks() {
        this._callHooks('afterBuildTicks');
      }
      beforeTickToLabelConversion() {
        callback(this.options.beforeTickToLabelConversion, [this]);
      }
      generateTickLabels(ticks) {
        const tickOpts = this.options.ticks;
        let i, ilen, tick;
        for (i = 0, ilen = ticks.length; i < ilen; i++) {
          tick = ticks[i];
          tick.label = callback(tickOpts.callback, [tick.value, i, ticks], this);
        }
      }
      afterTickToLabelConversion() {
        callback(this.options.afterTickToLabelConversion, [this]);
      }
      beforeCalculateLabelRotation() {
        callback(this.options.beforeCalculateLabelRotation, [this]);
      }
      calculateLabelRotation() {
        const options = this.options;
        const tickOpts = options.ticks;
        const numTicks = this.ticks.length;
        const minRotation = tickOpts.minRotation || 0;
        const maxRotation = tickOpts.maxRotation;
        let labelRotation = minRotation;
        let tickWidth, maxHeight, maxLabelDiagonal;
        if (!this._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !this.isHorizontal()) {
          this.labelRotation = minRotation;
          return;
        }
        const labelSizes = this._getLabelSizes();
        const maxLabelWidth = labelSizes.widest.width;
        const maxLabelHeight = labelSizes.highest.height;
        const maxWidth = _limitValue(this.chart.width - maxLabelWidth, 0, this.maxWidth);
        tickWidth = options.offset ? this.maxWidth / numTicks : maxWidth / (numTicks - 1);
        if (maxLabelWidth + 6 > tickWidth) {
          tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
          maxHeight = this.maxHeight - getTickMarkLength(options.grid)
    				- tickOpts.padding - getTitleHeight(options.title, this.chart.options.font);
          maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
          labelRotation = toDegrees(Math.min(
            Math.asin(_limitValue((labelSizes.highest.height + 6) / tickWidth, -1, 1)),
            Math.asin(_limitValue(maxHeight / maxLabelDiagonal, -1, 1)) - Math.asin(_limitValue(maxLabelHeight / maxLabelDiagonal, -1, 1))
          ));
          labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
        }
        this.labelRotation = labelRotation;
      }
      afterCalculateLabelRotation() {
        callback(this.options.afterCalculateLabelRotation, [this]);
      }
      beforeFit() {
        callback(this.options.beforeFit, [this]);
      }
      fit() {
        const minSize = {
          width: 0,
          height: 0
        };
        const {chart, options: {ticks: tickOpts, title: titleOpts, grid: gridOpts}} = this;
        const display = this._isVisible();
        const isHorizontal = this.isHorizontal();
        if (display) {
          const titleHeight = getTitleHeight(titleOpts, chart.options.font);
          if (isHorizontal) {
            minSize.width = this.maxWidth;
            minSize.height = getTickMarkLength(gridOpts) + titleHeight;
          } else {
            minSize.height = this.maxHeight;
            minSize.width = getTickMarkLength(gridOpts) + titleHeight;
          }
          if (tickOpts.display && this.ticks.length) {
            const {first, last, widest, highest} = this._getLabelSizes();
            const tickPadding = tickOpts.padding * 2;
            const angleRadians = toRadians(this.labelRotation);
            const cos = Math.cos(angleRadians);
            const sin = Math.sin(angleRadians);
            if (isHorizontal) {
              const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
              minSize.height = Math.min(this.maxHeight, minSize.height + labelHeight + tickPadding);
            } else {
              const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
              minSize.width = Math.min(this.maxWidth, minSize.width + labelWidth + tickPadding);
            }
            this._calculatePadding(first, last, sin, cos);
          }
        }
        this._handleMargins();
        if (isHorizontal) {
          this.width = this._length = chart.width - this._margins.left - this._margins.right;
          this.height = minSize.height;
        } else {
          this.width = minSize.width;
          this.height = this._length = chart.height - this._margins.top - this._margins.bottom;
        }
      }
      _calculatePadding(first, last, sin, cos) {
        const {ticks: {align, padding}, position} = this.options;
        const isRotated = this.labelRotation !== 0;
        const labelsBelowTicks = position !== 'top' && this.axis === 'x';
        if (this.isHorizontal()) {
          const offsetLeft = this.getPixelForTick(0) - this.left;
          const offsetRight = this.right - this.getPixelForTick(this.ticks.length - 1);
          let paddingLeft = 0;
          let paddingRight = 0;
          if (isRotated) {
            if (labelsBelowTicks) {
              paddingLeft = cos * first.width;
              paddingRight = sin * last.height;
            } else {
              paddingLeft = sin * first.height;
              paddingRight = cos * last.width;
            }
          } else if (align === 'start') {
            paddingRight = last.width;
          } else if (align === 'end') {
            paddingLeft = first.width;
          } else {
            paddingLeft = first.width / 2;
            paddingRight = last.width / 2;
          }
          this.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * this.width / (this.width - offsetLeft), 0);
          this.paddingRight = Math.max((paddingRight - offsetRight + padding) * this.width / (this.width - offsetRight), 0);
        } else {
          let paddingTop = last.height / 2;
          let paddingBottom = first.height / 2;
          if (align === 'start') {
            paddingTop = 0;
            paddingBottom = first.height;
          } else if (align === 'end') {
            paddingTop = last.height;
            paddingBottom = 0;
          }
          this.paddingTop = paddingTop + padding;
          this.paddingBottom = paddingBottom + padding;
        }
      }
      _handleMargins() {
        if (this._margins) {
          this._margins.left = Math.max(this.paddingLeft, this._margins.left);
          this._margins.top = Math.max(this.paddingTop, this._margins.top);
          this._margins.right = Math.max(this.paddingRight, this._margins.right);
          this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom);
        }
      }
      afterFit() {
        callback(this.options.afterFit, [this]);
      }
      isHorizontal() {
        const {axis, position} = this.options;
        return position === 'top' || position === 'bottom' || axis === 'x';
      }
      isFullSize() {
        return this.options.fullSize;
      }
      _convertTicksToLabels(ticks) {
        this.beforeTickToLabelConversion();
        this.generateTickLabels(ticks);
        let i, ilen;
        for (i = 0, ilen = ticks.length; i < ilen; i++) {
          if (isNullOrUndef(ticks[i].label)) {
            ticks.splice(i, 1);
            ilen--;
            i--;
          }
        }
        this.afterTickToLabelConversion();
      }
      _getLabelSizes() {
        let labelSizes = this._labelSizes;
        if (!labelSizes) {
          const sampleSize = this.options.ticks.sampleSize;
          let ticks = this.ticks;
          if (sampleSize < ticks.length) {
            ticks = sample(ticks, sampleSize);
          }
          this._labelSizes = labelSizes = this._computeLabelSizes(ticks, ticks.length);
        }
        return labelSizes;
      }
      _computeLabelSizes(ticks, length) {
        const {ctx, _longestTextCache: caches} = this;
        const widths = [];
        const heights = [];
        let widestLabelSize = 0;
        let highestLabelSize = 0;
        let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;
        for (i = 0; i < length; ++i) {
          label = ticks[i].label;
          tickFont = this._resolveTickFontOptions(i);
          ctx.font = fontString = tickFont.string;
          cache = caches[fontString] = caches[fontString] || {data: {}, gc: []};
          lineHeight = tickFont.lineHeight;
          width = height = 0;
          if (!isNullOrUndef(label) && !isArray(label)) {
            width = _measureText(ctx, cache.data, cache.gc, width, label);
            height = lineHeight;
          } else if (isArray(label)) {
            for (j = 0, jlen = label.length; j < jlen; ++j) {
              nestedLabel = label[j];
              if (!isNullOrUndef(nestedLabel) && !isArray(nestedLabel)) {
                width = _measureText(ctx, cache.data, cache.gc, width, nestedLabel);
                height += lineHeight;
              }
            }
          }
          widths.push(width);
          heights.push(height);
          widestLabelSize = Math.max(width, widestLabelSize);
          highestLabelSize = Math.max(height, highestLabelSize);
        }
        garbageCollect(caches, length);
        const widest = widths.indexOf(widestLabelSize);
        const highest = heights.indexOf(highestLabelSize);
        const valueAt = (idx) => ({width: widths[idx] || 0, height: heights[idx] || 0});
        return {
          first: valueAt(0),
          last: valueAt(length - 1),
          widest: valueAt(widest),
          highest: valueAt(highest),
          widths,
          heights,
        };
      }
      getLabelForValue(value) {
        return value;
      }
      getPixelForValue(value, index) {
        return NaN;
      }
      getValueForPixel(pixel) {}
      getPixelForTick(index) {
        const ticks = this.ticks;
        if (index < 0 || index > ticks.length - 1) {
          return null;
        }
        return this.getPixelForValue(ticks[index].value);
      }
      getPixelForDecimal(decimal) {
        if (this._reversePixels) {
          decimal = 1 - decimal;
        }
        const pixel = this._startPixel + decimal * this._length;
        return _int16Range(this._alignToPixels ? _alignPixel(this.chart, pixel, 0) : pixel);
      }
      getDecimalForPixel(pixel) {
        const decimal = (pixel - this._startPixel) / this._length;
        return this._reversePixels ? 1 - decimal : decimal;
      }
      getBasePixel() {
        return this.getPixelForValue(this.getBaseValue());
      }
      getBaseValue() {
        const {min, max} = this;
        return min < 0 && max < 0 ? max :
          min > 0 && max > 0 ? min :
          0;
      }
      getContext(index) {
        const ticks = this.ticks || [];
        if (index >= 0 && index < ticks.length) {
          const tick = ticks[index];
          return tick.$context ||
    				(tick.$context = createTickContext(this.getContext(), index, tick));
        }
        return this.$context ||
    			(this.$context = createScaleContext(this.chart.getContext(), this));
      }
      _tickSize() {
        const optionTicks = this.options.ticks;
        const rot = toRadians(this.labelRotation);
        const cos = Math.abs(Math.cos(rot));
        const sin = Math.abs(Math.sin(rot));
        const labelSizes = this._getLabelSizes();
        const padding = optionTicks.autoSkipPadding || 0;
        const w = labelSizes ? labelSizes.widest.width + padding : 0;
        const h = labelSizes ? labelSizes.highest.height + padding : 0;
        return this.isHorizontal()
          ? h * cos > w * sin ? w / cos : h / sin
          : h * sin < w * cos ? h / cos : w / sin;
      }
      _isVisible() {
        const display = this.options.display;
        if (display !== 'auto') {
          return !!display;
        }
        return this.getMatchingVisibleMetas().length > 0;
      }
      _computeGridLineItems(chartArea) {
        const axis = this.axis;
        const chart = this.chart;
        const options = this.options;
        const {grid, position} = options;
        const offset = grid.offset;
        const isHorizontal = this.isHorizontal();
        const ticks = this.ticks;
        const ticksLength = ticks.length + (offset ? 1 : 0);
        const tl = getTickMarkLength(grid);
        const items = [];
        const borderOpts = grid.setContext(this.getContext());
        const axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0;
        const axisHalfWidth = axisWidth / 2;
        const alignBorderValue = function(pixel) {
          return _alignPixel(chart, pixel, axisWidth);
        };
        let borderValue, i, lineValue, alignedLineValue;
        let tx1, ty1, tx2, ty2, x1, y1, x2, y2;
        if (position === 'top') {
          borderValue = alignBorderValue(this.bottom);
          ty1 = this.bottom - tl;
          ty2 = borderValue - axisHalfWidth;
          y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
          y2 = chartArea.bottom;
        } else if (position === 'bottom') {
          borderValue = alignBorderValue(this.top);
          y1 = chartArea.top;
          y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
          ty1 = borderValue + axisHalfWidth;
          ty2 = this.top + tl;
        } else if (position === 'left') {
          borderValue = alignBorderValue(this.right);
          tx1 = this.right - tl;
          tx2 = borderValue - axisHalfWidth;
          x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
          x2 = chartArea.right;
        } else if (position === 'right') {
          borderValue = alignBorderValue(this.left);
          x1 = chartArea.left;
          x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
          tx1 = borderValue + axisHalfWidth;
          tx2 = this.left + tl;
        } else if (axis === 'x') {
          if (position === 'center') {
            borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
          } else if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
          }
          y1 = chartArea.top;
          y2 = chartArea.bottom;
          ty1 = borderValue + axisHalfWidth;
          ty2 = ty1 + tl;
        } else if (axis === 'y') {
          if (position === 'center') {
            borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
          } else if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            borderValue = alignBorderValue(this.chart.scales[positionAxisID].getPixelForValue(value));
          }
          tx1 = borderValue - axisHalfWidth;
          tx2 = tx1 - tl;
          x1 = chartArea.left;
          x2 = chartArea.right;
        }
        const limit = valueOrDefault(options.ticks.maxTicksLimit, ticksLength);
        const step = Math.max(1, Math.ceil(ticksLength / limit));
        for (i = 0; i < ticksLength; i += step) {
          const optsAtIndex = grid.setContext(this.getContext(i));
          const lineWidth = optsAtIndex.lineWidth;
          const lineColor = optsAtIndex.color;
          const borderDash = grid.borderDash || [];
          const borderDashOffset = optsAtIndex.borderDashOffset;
          const tickWidth = optsAtIndex.tickWidth;
          const tickColor = optsAtIndex.tickColor;
          const tickBorderDash = optsAtIndex.tickBorderDash || [];
          const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
          lineValue = getPixelForGridLine(this, i, offset);
          if (lineValue === undefined) {
            continue;
          }
          alignedLineValue = _alignPixel(chart, lineValue, lineWidth);
          if (isHorizontal) {
            tx1 = tx2 = x1 = x2 = alignedLineValue;
          } else {
            ty1 = ty2 = y1 = y2 = alignedLineValue;
          }
          items.push({
            tx1,
            ty1,
            tx2,
            ty2,
            x1,
            y1,
            x2,
            y2,
            width: lineWidth,
            color: lineColor,
            borderDash,
            borderDashOffset,
            tickWidth,
            tickColor,
            tickBorderDash,
            tickBorderDashOffset,
          });
        }
        this._ticksLength = ticksLength;
        this._borderValue = borderValue;
        return items;
      }
      _computeLabelItems(chartArea) {
        const axis = this.axis;
        const options = this.options;
        const {position, ticks: optionTicks} = options;
        const isHorizontal = this.isHorizontal();
        const ticks = this.ticks;
        const {align, crossAlign, padding, mirror} = optionTicks;
        const tl = getTickMarkLength(options.grid);
        const tickAndPadding = tl + padding;
        const hTickAndPadding = mirror ? -padding : tickAndPadding;
        const rotation = -toRadians(this.labelRotation);
        const items = [];
        let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
        let textBaseline = 'middle';
        if (position === 'top') {
          y = this.bottom - hTickAndPadding;
          textAlign = this._getXAxisLabelAlignment();
        } else if (position === 'bottom') {
          y = this.top + hTickAndPadding;
          textAlign = this._getXAxisLabelAlignment();
        } else if (position === 'left') {
          const ret = this._getYAxisLabelAlignment(tl);
          textAlign = ret.textAlign;
          x = ret.x;
        } else if (position === 'right') {
          const ret = this._getYAxisLabelAlignment(tl);
          textAlign = ret.textAlign;
          x = ret.x;
        } else if (axis === 'x') {
          if (position === 'center') {
            y = ((chartArea.top + chartArea.bottom) / 2) + tickAndPadding;
          } else if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            y = this.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
          }
          textAlign = this._getXAxisLabelAlignment();
        } else if (axis === 'y') {
          if (position === 'center') {
            x = ((chartArea.left + chartArea.right) / 2) - tickAndPadding;
          } else if (isObject(position)) {
            const positionAxisID = Object.keys(position)[0];
            const value = position[positionAxisID];
            x = this.chart.scales[positionAxisID].getPixelForValue(value);
          }
          textAlign = this._getYAxisLabelAlignment(tl).textAlign;
        }
        if (axis === 'y') {
          if (align === 'start') {
            textBaseline = 'top';
          } else if (align === 'end') {
            textBaseline = 'bottom';
          }
        }
        const labelSizes = this._getLabelSizes();
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
          tick = ticks[i];
          label = tick.label;
          const optsAtIndex = optionTicks.setContext(this.getContext(i));
          pixel = this.getPixelForTick(i) + optionTicks.labelOffset;
          font = this._resolveTickFontOptions(i);
          lineHeight = font.lineHeight;
          lineCount = isArray(label) ? label.length : 1;
          const halfCount = lineCount / 2;
          const color = optsAtIndex.color;
          const strokeColor = optsAtIndex.textStrokeColor;
          const strokeWidth = optsAtIndex.textStrokeWidth;
          if (isHorizontal) {
            x = pixel;
            if (position === 'top') {
              if (crossAlign === 'near' || rotation !== 0) {
                textOffset = -lineCount * lineHeight + lineHeight / 2;
              } else if (crossAlign === 'center') {
                textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
              } else {
                textOffset = -labelSizes.highest.height + lineHeight / 2;
              }
            } else {
              if (crossAlign === 'near' || rotation !== 0) {
                textOffset = lineHeight / 2;
              } else if (crossAlign === 'center') {
                textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
              } else {
                textOffset = labelSizes.highest.height - lineCount * lineHeight;
              }
            }
            if (mirror) {
              textOffset *= -1;
            }
          } else {
            y = pixel;
            textOffset = (1 - lineCount) * lineHeight / 2;
          }
          let backdrop;
          if (optsAtIndex.showLabelBackdrop) {
            const labelPadding = toPadding(optsAtIndex.backdropPadding);
            const height = labelSizes.heights[i];
            const width = labelSizes.widths[i];
            let top = y + textOffset - labelPadding.top;
            let left = x - labelPadding.left;
            switch (textBaseline) {
            case 'middle':
              top -= height / 2;
              break;
            case 'bottom':
              top -= height;
              break;
            }
            switch (textAlign) {
            case 'center':
              left -= width / 2;
              break;
            case 'right':
              left -= width;
              break;
            }
            backdrop = {
              left,
              top,
              width: width + labelPadding.width,
              height: height + labelPadding.height,
              color: optsAtIndex.backdropColor,
            };
          }
          items.push({
            rotation,
            label,
            font,
            color,
            strokeColor,
            strokeWidth,
            textOffset,
            textAlign,
            textBaseline,
            translation: [x, y],
            backdrop,
          });
        }
        return items;
      }
      _getXAxisLabelAlignment() {
        const {position, ticks} = this.options;
        const rotation = -toRadians(this.labelRotation);
        if (rotation) {
          return position === 'top' ? 'left' : 'right';
        }
        let align = 'center';
        if (ticks.align === 'start') {
          align = 'left';
        } else if (ticks.align === 'end') {
          align = 'right';
        }
        return align;
      }
      _getYAxisLabelAlignment(tl) {
        const {position, ticks: {crossAlign, mirror, padding}} = this.options;
        const labelSizes = this._getLabelSizes();
        const tickAndPadding = tl + padding;
        const widest = labelSizes.widest.width;
        let textAlign;
        let x;
        if (position === 'left') {
          if (mirror) {
            x = this.right + padding;
            if (crossAlign === 'near') {
              textAlign = 'left';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x += (widest / 2);
            } else {
              textAlign = 'right';
              x += widest;
            }
          } else {
            x = this.right - tickAndPadding;
            if (crossAlign === 'near') {
              textAlign = 'right';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x -= (widest / 2);
            } else {
              textAlign = 'left';
              x = this.left;
            }
          }
        } else if (position === 'right') {
          if (mirror) {
            x = this.left + padding;
            if (crossAlign === 'near') {
              textAlign = 'right';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x -= (widest / 2);
            } else {
              textAlign = 'left';
              x -= widest;
            }
          } else {
            x = this.left + tickAndPadding;
            if (crossAlign === 'near') {
              textAlign = 'left';
            } else if (crossAlign === 'center') {
              textAlign = 'center';
              x += widest / 2;
            } else {
              textAlign = 'right';
              x = this.right;
            }
          }
        } else {
          textAlign = 'right';
        }
        return {textAlign, x};
      }
      _computeLabelArea() {
        if (this.options.ticks.mirror) {
          return;
        }
        const chart = this.chart;
        const position = this.options.position;
        if (position === 'left' || position === 'right') {
          return {top: 0, left: this.left, bottom: chart.height, right: this.right};
        } if (position === 'top' || position === 'bottom') {
          return {top: this.top, left: 0, bottom: this.bottom, right: chart.width};
        }
      }
      drawBackground() {
        const {ctx, options: {backgroundColor}, left, top, width, height} = this;
        if (backgroundColor) {
          ctx.save();
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(left, top, width, height);
          ctx.restore();
        }
      }
      getLineWidthForValue(value) {
        const grid = this.options.grid;
        if (!this._isVisible() || !grid.display) {
          return 0;
        }
        const ticks = this.ticks;
        const index = ticks.findIndex(t => t.value === value);
        if (index >= 0) {
          const opts = grid.setContext(this.getContext(index));
          return opts.lineWidth;
        }
        return 0;
      }
      drawGrid(chartArea) {
        const grid = this.options.grid;
        const ctx = this.ctx;
        const items = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(chartArea));
        let i, ilen;
        const drawLine = (p1, p2, style) => {
          if (!style.width || !style.color) {
            return;
          }
          ctx.save();
          ctx.lineWidth = style.width;
          ctx.strokeStyle = style.color;
          ctx.setLineDash(style.borderDash || []);
          ctx.lineDashOffset = style.borderDashOffset;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        };
        if (grid.display) {
          for (i = 0, ilen = items.length; i < ilen; ++i) {
            const item = items[i];
            if (grid.drawOnChartArea) {
              drawLine(
                {x: item.x1, y: item.y1},
                {x: item.x2, y: item.y2},
                item
              );
            }
            if (grid.drawTicks) {
              drawLine(
                {x: item.tx1, y: item.ty1},
                {x: item.tx2, y: item.ty2},
                {
                  color: item.tickColor,
                  width: item.tickWidth,
                  borderDash: item.tickBorderDash,
                  borderDashOffset: item.tickBorderDashOffset
                }
              );
            }
          }
        }
      }
      drawBorder() {
        const {chart, ctx, options: {grid}} = this;
        const borderOpts = grid.setContext(this.getContext());
        const axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0;
        if (!axisWidth) {
          return;
        }
        const lastLineWidth = grid.setContext(this.getContext(0)).lineWidth;
        const borderValue = this._borderValue;
        let x1, x2, y1, y2;
        if (this.isHorizontal()) {
          x1 = _alignPixel(chart, this.left, axisWidth) - axisWidth / 2;
          x2 = _alignPixel(chart, this.right, lastLineWidth) + lastLineWidth / 2;
          y1 = y2 = borderValue;
        } else {
          y1 = _alignPixel(chart, this.top, axisWidth) - axisWidth / 2;
          y2 = _alignPixel(chart, this.bottom, lastLineWidth) + lastLineWidth / 2;
          x1 = x2 = borderValue;
        }
        ctx.save();
        ctx.lineWidth = borderOpts.borderWidth;
        ctx.strokeStyle = borderOpts.borderColor;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }
      drawLabels(chartArea) {
        const optionTicks = this.options.ticks;
        if (!optionTicks.display) {
          return;
        }
        const ctx = this.ctx;
        const area = this._computeLabelArea();
        if (area) {
          clipArea(ctx, area);
        }
        const items = this._labelItems || (this._labelItems = this._computeLabelItems(chartArea));
        let i, ilen;
        for (i = 0, ilen = items.length; i < ilen; ++i) {
          const item = items[i];
          const tickFont = item.font;
          const label = item.label;
          if (item.backdrop) {
            ctx.fillStyle = item.backdrop.color;
            ctx.fillRect(item.backdrop.left, item.backdrop.top, item.backdrop.width, item.backdrop.height);
          }
          let y = item.textOffset;
          renderText(ctx, label, 0, y, tickFont, item);
        }
        if (area) {
          unclipArea(ctx);
        }
      }
      drawTitle() {
        const {ctx, options: {position, title, reverse}} = this;
        if (!title.display) {
          return;
        }
        const font = toFont(title.font);
        const padding = toPadding(title.padding);
        const align = title.align;
        let offset = font.lineHeight / 2;
        if (position === 'bottom' || position === 'center' || isObject(position)) {
          offset += padding.bottom;
          if (isArray(title.text)) {
            offset += font.lineHeight * (title.text.length - 1);
          }
        } else {
          offset += padding.top;
        }
        const {titleX, titleY, maxWidth, rotation} = titleArgs(this, offset, position, align);
        renderText(ctx, title.text, 0, 0, font, {
          color: title.color,
          maxWidth,
          rotation,
          textAlign: titleAlign(align, position, reverse),
          textBaseline: 'middle',
          translation: [titleX, titleY],
        });
      }
      draw(chartArea) {
        if (!this._isVisible()) {
          return;
        }
        this.drawBackground();
        this.drawGrid(chartArea);
        this.drawBorder();
        this.drawTitle();
        this.drawLabels(chartArea);
      }
      _layers() {
        const opts = this.options;
        const tz = opts.ticks && opts.ticks.z || 0;
        const gz = valueOrDefault(opts.grid && opts.grid.z, -1);
        if (!this._isVisible() || this.draw !== Scale.prototype.draw) {
          return [{
            z: tz,
            draw: (chartArea) => {
              this.draw(chartArea);
            }
          }];
        }
        return [{
          z: gz,
          draw: (chartArea) => {
            this.drawBackground();
            this.drawGrid(chartArea);
            this.drawTitle();
          }
        }, {
          z: gz + 1,
          draw: () => {
            this.drawBorder();
          }
        }, {
          z: tz,
          draw: (chartArea) => {
            this.drawLabels(chartArea);
          }
        }];
      }
      getMatchingVisibleMetas(type) {
        const metas = this.chart.getSortedVisibleDatasetMetas();
        const axisID = this.axis + 'AxisID';
        const result = [];
        let i, ilen;
        for (i = 0, ilen = metas.length; i < ilen; ++i) {
          const meta = metas[i];
          if (meta[axisID] === this.id && (!type || meta.type === type)) {
            result.push(meta);
          }
        }
        return result;
      }
      _resolveTickFontOptions(index) {
        const opts = this.options.ticks.setContext(this.getContext(index));
        return toFont(opts.font);
      }
      _maxDigits() {
        const fontSize = this._resolveTickFontOptions(0).lineHeight;
        return (this.isHorizontal() ? this.width : this.height) / fontSize;
      }
    }

    class TypedRegistry {
      constructor(type, scope, override) {
        this.type = type;
        this.scope = scope;
        this.override = override;
        this.items = Object.create(null);
      }
      isForType(type) {
        return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
      }
      register(item) {
        const proto = Object.getPrototypeOf(item);
        let parentScope;
        if (isIChartComponent(proto)) {
          parentScope = this.register(proto);
        }
        const items = this.items;
        const id = item.id;
        const scope = this.scope + '.' + id;
        if (!id) {
          throw new Error('class does not have id: ' + item);
        }
        if (id in items) {
          return scope;
        }
        items[id] = item;
        registerDefaults(item, scope, parentScope);
        if (this.override) {
          defaults.override(item.id, item.overrides);
        }
        return scope;
      }
      get(id) {
        return this.items[id];
      }
      unregister(item) {
        const items = this.items;
        const id = item.id;
        const scope = this.scope;
        if (id in items) {
          delete items[id];
        }
        if (scope && id in defaults[scope]) {
          delete defaults[scope][id];
          if (this.override) {
            delete overrides[id];
          }
        }
      }
    }
    function registerDefaults(item, scope, parentScope) {
      const itemDefaults = merge(Object.create(null), [
        parentScope ? defaults.get(parentScope) : {},
        defaults.get(scope),
        item.defaults
      ]);
      defaults.set(scope, itemDefaults);
      if (item.defaultRoutes) {
        routeDefaults(scope, item.defaultRoutes);
      }
      if (item.descriptors) {
        defaults.describe(scope, item.descriptors);
      }
    }
    function routeDefaults(scope, routes) {
      Object.keys(routes).forEach(property => {
        const propertyParts = property.split('.');
        const sourceName = propertyParts.pop();
        const sourceScope = [scope].concat(propertyParts).join('.');
        const parts = routes[property].split('.');
        const targetName = parts.pop();
        const targetScope = parts.join('.');
        defaults.route(sourceScope, sourceName, targetScope, targetName);
      });
    }
    function isIChartComponent(proto) {
      return 'id' in proto && 'defaults' in proto;
    }

    class Registry {
      constructor() {
        this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
        this.elements = new TypedRegistry(Element, 'elements');
        this.plugins = new TypedRegistry(Object, 'plugins');
        this.scales = new TypedRegistry(Scale, 'scales');
        this._typedRegistries = [this.controllers, this.scales, this.elements];
      }
      add(...args) {
        this._each('register', args);
      }
      remove(...args) {
        this._each('unregister', args);
      }
      addControllers(...args) {
        this._each('register', args, this.controllers);
      }
      addElements(...args) {
        this._each('register', args, this.elements);
      }
      addPlugins(...args) {
        this._each('register', args, this.plugins);
      }
      addScales(...args) {
        this._each('register', args, this.scales);
      }
      getController(id) {
        return this._get(id, this.controllers, 'controller');
      }
      getElement(id) {
        return this._get(id, this.elements, 'element');
      }
      getPlugin(id) {
        return this._get(id, this.plugins, 'plugin');
      }
      getScale(id) {
        return this._get(id, this.scales, 'scale');
      }
      removeControllers(...args) {
        this._each('unregister', args, this.controllers);
      }
      removeElements(...args) {
        this._each('unregister', args, this.elements);
      }
      removePlugins(...args) {
        this._each('unregister', args, this.plugins);
      }
      removeScales(...args) {
        this._each('unregister', args, this.scales);
      }
      _each(method, args, typedRegistry) {
        [...args].forEach(arg => {
          const reg = typedRegistry || this._getRegistryForType(arg);
          if (typedRegistry || reg.isForType(arg) || (reg === this.plugins && arg.id)) {
            this._exec(method, reg, arg);
          } else {
            each(arg, item => {
              const itemReg = typedRegistry || this._getRegistryForType(item);
              this._exec(method, itemReg, item);
            });
          }
        });
      }
      _exec(method, registry, component) {
        const camelMethod = _capitalize(method);
        callback(component['before' + camelMethod], [], component);
        registry[method](component);
        callback(component['after' + camelMethod], [], component);
      }
      _getRegistryForType(type) {
        for (let i = 0; i < this._typedRegistries.length; i++) {
          const reg = this._typedRegistries[i];
          if (reg.isForType(type)) {
            return reg;
          }
        }
        return this.plugins;
      }
      _get(id, typedRegistry, type) {
        const item = typedRegistry.get(id);
        if (item === undefined) {
          throw new Error('"' + id + '" is not a registered ' + type + '.');
        }
        return item;
      }
    }
    var registry = new Registry();

    class PluginService {
      constructor() {
        this._init = [];
      }
      notify(chart, hook, args, filter) {
        if (hook === 'beforeInit') {
          this._init = this._createDescriptors(chart, true);
          this._notify(this._init, chart, 'install');
        }
        const descriptors = filter ? this._descriptors(chart).filter(filter) : this._descriptors(chart);
        const result = this._notify(descriptors, chart, hook, args);
        if (hook === 'afterDestroy') {
          this._notify(descriptors, chart, 'stop');
          this._notify(this._init, chart, 'uninstall');
        }
        return result;
      }
      _notify(descriptors, chart, hook, args) {
        args = args || {};
        for (const descriptor of descriptors) {
          const plugin = descriptor.plugin;
          const method = plugin[hook];
          const params = [chart, args, descriptor.options];
          if (callback(method, params, plugin) === false && args.cancelable) {
            return false;
          }
        }
        return true;
      }
      invalidate() {
        if (!isNullOrUndef(this._cache)) {
          this._oldCache = this._cache;
          this._cache = undefined;
        }
      }
      _descriptors(chart) {
        if (this._cache) {
          return this._cache;
        }
        const descriptors = this._cache = this._createDescriptors(chart);
        this._notifyStateChanges(chart);
        return descriptors;
      }
      _createDescriptors(chart, all) {
        const config = chart && chart.config;
        const options = valueOrDefault(config.options && config.options.plugins, {});
        const plugins = allPlugins(config);
        return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
      }
      _notifyStateChanges(chart) {
        const previousDescriptors = this._oldCache || [];
        const descriptors = this._cache;
        const diff = (a, b) => a.filter(x => !b.some(y => x.plugin.id === y.plugin.id));
        this._notify(diff(previousDescriptors, descriptors), chart, 'stop');
        this._notify(diff(descriptors, previousDescriptors), chart, 'start');
      }
    }
    function allPlugins(config) {
      const plugins = [];
      const keys = Object.keys(registry.plugins.items);
      for (let i = 0; i < keys.length; i++) {
        plugins.push(registry.getPlugin(keys[i]));
      }
      const local = config.plugins || [];
      for (let i = 0; i < local.length; i++) {
        const plugin = local[i];
        if (plugins.indexOf(plugin) === -1) {
          plugins.push(plugin);
        }
      }
      return plugins;
    }
    function getOpts(options, all) {
      if (!all && options === false) {
        return null;
      }
      if (options === true) {
        return {};
      }
      return options;
    }
    function createDescriptors(chart, plugins, options, all) {
      const result = [];
      const context = chart.getContext();
      for (let i = 0; i < plugins.length; i++) {
        const plugin = plugins[i];
        const id = plugin.id;
        const opts = getOpts(options[id], all);
        if (opts === null) {
          continue;
        }
        result.push({
          plugin,
          options: pluginOpts(chart.config, plugin, opts, context)
        });
      }
      return result;
    }
    function pluginOpts(config, plugin, opts, context) {
      const keys = config.pluginScopeKeys(plugin);
      const scopes = config.getOptionScopes(opts, keys);
      return config.createResolver(scopes, context, [''], {scriptable: false, indexable: false, allKeys: true});
    }

    function getIndexAxis(type, options) {
      const datasetDefaults = defaults.datasets[type] || {};
      const datasetOptions = (options.datasets || {})[type] || {};
      return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
    }
    function getAxisFromDefaultScaleID(id, indexAxis) {
      let axis = id;
      if (id === '_index_') {
        axis = indexAxis;
      } else if (id === '_value_') {
        axis = indexAxis === 'x' ? 'y' : 'x';
      }
      return axis;
    }
    function getDefaultScaleIDFromAxis(axis, indexAxis) {
      return axis === indexAxis ? '_index_' : '_value_';
    }
    function axisFromPosition(position) {
      if (position === 'top' || position === 'bottom') {
        return 'x';
      }
      if (position === 'left' || position === 'right') {
        return 'y';
      }
    }
    function determineAxis(id, scaleOptions) {
      if (id === 'x' || id === 'y') {
        return id;
      }
      return scaleOptions.axis || axisFromPosition(scaleOptions.position) || id.charAt(0).toLowerCase();
    }
    function mergeScaleConfig(config, options) {
      const chartDefaults = overrides[config.type] || {scales: {}};
      const configScales = options.scales || {};
      const chartIndexAxis = getIndexAxis(config.type, options);
      const firstIDs = Object.create(null);
      const scales = Object.create(null);
      Object.keys(configScales).forEach(id => {
        const scaleConf = configScales[id];
        if (!isObject(scaleConf)) {
          return console.error(`Invalid scale configuration for scale: ${id}`);
        }
        if (scaleConf._proxy) {
          return console.warn(`Ignoring resolver passed as options for scale: ${id}`);
        }
        const axis = determineAxis(id, scaleConf);
        const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
        const defaultScaleOptions = chartDefaults.scales || {};
        firstIDs[axis] = firstIDs[axis] || id;
        scales[id] = mergeIf(Object.create(null), [{axis}, scaleConf, defaultScaleOptions[axis], defaultScaleOptions[defaultId]]);
      });
      config.data.datasets.forEach(dataset => {
        const type = dataset.type || config.type;
        const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
        const datasetDefaults = overrides[type] || {};
        const defaultScaleOptions = datasetDefaults.scales || {};
        Object.keys(defaultScaleOptions).forEach(defaultID => {
          const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
          const id = dataset[axis + 'AxisID'] || firstIDs[axis] || axis;
          scales[id] = scales[id] || Object.create(null);
          mergeIf(scales[id], [{axis}, configScales[id], defaultScaleOptions[defaultID]]);
        });
      });
      Object.keys(scales).forEach(key => {
        const scale = scales[key];
        mergeIf(scale, [defaults.scales[scale.type], defaults.scale]);
      });
      return scales;
    }
    function initOptions(config) {
      const options = config.options || (config.options = {});
      options.plugins = valueOrDefault(options.plugins, {});
      options.scales = mergeScaleConfig(config, options);
    }
    function initData(data) {
      data = data || {};
      data.datasets = data.datasets || [];
      data.labels = data.labels || [];
      return data;
    }
    function initConfig(config) {
      config = config || {};
      config.data = initData(config.data);
      initOptions(config);
      return config;
    }
    const keyCache = new Map();
    const keysCached = new Set();
    function cachedKeys(cacheKey, generate) {
      let keys = keyCache.get(cacheKey);
      if (!keys) {
        keys = generate();
        keyCache.set(cacheKey, keys);
        keysCached.add(keys);
      }
      return keys;
    }
    const addIfFound = (set, obj, key) => {
      const opts = resolveObjectKey(obj, key);
      if (opts !== undefined) {
        set.add(opts);
      }
    };
    class Config {
      constructor(config) {
        this._config = initConfig(config);
        this._scopeCache = new Map();
        this._resolverCache = new Map();
      }
      get platform() {
        return this._config.platform;
      }
      get type() {
        return this._config.type;
      }
      set type(type) {
        this._config.type = type;
      }
      get data() {
        return this._config.data;
      }
      set data(data) {
        this._config.data = initData(data);
      }
      get options() {
        return this._config.options;
      }
      set options(options) {
        this._config.options = options;
      }
      get plugins() {
        return this._config.plugins;
      }
      update() {
        const config = this._config;
        this.clearCache();
        initOptions(config);
      }
      clearCache() {
        this._scopeCache.clear();
        this._resolverCache.clear();
      }
      datasetScopeKeys(datasetType) {
        return cachedKeys(datasetType,
          () => [[
            `datasets.${datasetType}`,
            ''
          ]]);
      }
      datasetAnimationScopeKeys(datasetType, transition) {
        return cachedKeys(`${datasetType}.transition.${transition}`,
          () => [
            [
              `datasets.${datasetType}.transitions.${transition}`,
              `transitions.${transition}`,
            ],
            [
              `datasets.${datasetType}`,
              ''
            ]
          ]);
      }
      datasetElementScopeKeys(datasetType, elementType) {
        return cachedKeys(`${datasetType}-${elementType}`,
          () => [[
            `datasets.${datasetType}.elements.${elementType}`,
            `datasets.${datasetType}`,
            `elements.${elementType}`,
            ''
          ]]);
      }
      pluginScopeKeys(plugin) {
        const id = plugin.id;
        const type = this.type;
        return cachedKeys(`${type}-plugin-${id}`,
          () => [[
            `plugins.${id}`,
            ...plugin.additionalOptionScopes || [],
          ]]);
      }
      _cachedScopes(mainScope, resetCache) {
        const _scopeCache = this._scopeCache;
        let cache = _scopeCache.get(mainScope);
        if (!cache || resetCache) {
          cache = new Map();
          _scopeCache.set(mainScope, cache);
        }
        return cache;
      }
      getOptionScopes(mainScope, keyLists, resetCache) {
        const {options, type} = this;
        const cache = this._cachedScopes(mainScope, resetCache);
        const cached = cache.get(keyLists);
        if (cached) {
          return cached;
        }
        const scopes = new Set();
        keyLists.forEach(keys => {
          if (mainScope) {
            scopes.add(mainScope);
            keys.forEach(key => addIfFound(scopes, mainScope, key));
          }
          keys.forEach(key => addIfFound(scopes, options, key));
          keys.forEach(key => addIfFound(scopes, overrides[type] || {}, key));
          keys.forEach(key => addIfFound(scopes, defaults, key));
          keys.forEach(key => addIfFound(scopes, descriptors, key));
        });
        const array = Array.from(scopes);
        if (array.length === 0) {
          array.push(Object.create(null));
        }
        if (keysCached.has(keyLists)) {
          cache.set(keyLists, array);
        }
        return array;
      }
      chartOptionScopes() {
        const {options, type} = this;
        return [
          options,
          overrides[type] || {},
          defaults.datasets[type] || {},
          {type},
          defaults,
          descriptors
        ];
      }
      resolveNamedOptions(scopes, names, context, prefixes = ['']) {
        const result = {$shared: true};
        const {resolver, subPrefixes} = getResolver(this._resolverCache, scopes, prefixes);
        let options = resolver;
        if (needContext(resolver, names)) {
          result.$shared = false;
          context = isFunction(context) ? context() : context;
          const subResolver = this.createResolver(scopes, context, subPrefixes);
          options = _attachContext(resolver, context, subResolver);
        }
        for (const prop of names) {
          result[prop] = options[prop];
        }
        return result;
      }
      createResolver(scopes, context, prefixes = [''], descriptorDefaults) {
        const {resolver} = getResolver(this._resolverCache, scopes, prefixes);
        return isObject(context)
          ? _attachContext(resolver, context, undefined, descriptorDefaults)
          : resolver;
      }
    }
    function getResolver(resolverCache, scopes, prefixes) {
      let cache = resolverCache.get(scopes);
      if (!cache) {
        cache = new Map();
        resolverCache.set(scopes, cache);
      }
      const cacheKey = prefixes.join();
      let cached = cache.get(cacheKey);
      if (!cached) {
        const resolver = _createResolver(scopes, prefixes);
        cached = {
          resolver,
          subPrefixes: prefixes.filter(p => !p.toLowerCase().includes('hover'))
        };
        cache.set(cacheKey, cached);
      }
      return cached;
    }
    const hasFunction = value => isObject(value)
      && Object.getOwnPropertyNames(value).reduce((acc, key) => acc || isFunction(value[key]), false);
    function needContext(proxy, names) {
      const {isScriptable, isIndexable} = _descriptors(proxy);
      for (const prop of names) {
        const scriptable = isScriptable(prop);
        const indexable = isIndexable(prop);
        const value = (indexable || scriptable) && proxy[prop];
        if ((scriptable && (isFunction(value) || hasFunction(value)))
          || (indexable && isArray(value))) {
          return true;
        }
      }
      return false;
    }

    var version = "3.7.1";

    const KNOWN_POSITIONS = ['top', 'bottom', 'left', 'right', 'chartArea'];
    function positionIsHorizontal(position, axis) {
      return position === 'top' || position === 'bottom' || (KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x');
    }
    function compare2Level(l1, l2) {
      return function(a, b) {
        return a[l1] === b[l1]
          ? a[l2] - b[l2]
          : a[l1] - b[l1];
      };
    }
    function onAnimationsComplete(context) {
      const chart = context.chart;
      const animationOptions = chart.options.animation;
      chart.notifyPlugins('afterRender');
      callback(animationOptions && animationOptions.onComplete, [context], chart);
    }
    function onAnimationProgress(context) {
      const chart = context.chart;
      const animationOptions = chart.options.animation;
      callback(animationOptions && animationOptions.onProgress, [context], chart);
    }
    function getCanvas(item) {
      if (_isDomSupported() && typeof item === 'string') {
        item = document.getElementById(item);
      } else if (item && item.length) {
        item = item[0];
      }
      if (item && item.canvas) {
        item = item.canvas;
      }
      return item;
    }
    const instances = {};
    const getChart = (key) => {
      const canvas = getCanvas(key);
      return Object.values(instances).filter((c) => c.canvas === canvas).pop();
    };
    function moveNumericKeys(obj, start, move) {
      const keys = Object.keys(obj);
      for (const key of keys) {
        const intKey = +key;
        if (intKey >= start) {
          const value = obj[key];
          delete obj[key];
          if (move > 0 || intKey > start) {
            obj[intKey + move] = value;
          }
        }
      }
    }
    function determineLastEvent(e, lastEvent, inChartArea, isClick) {
      if (!inChartArea || e.type === 'mouseout') {
        return null;
      }
      if (isClick) {
        return lastEvent;
      }
      return e;
    }
    class Chart {
      constructor(item, userConfig) {
        const config = this.config = new Config(userConfig);
        const initialCanvas = getCanvas(item);
        const existingChart = getChart(initialCanvas);
        if (existingChart) {
          throw new Error(
            'Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' +
    				' must be destroyed before the canvas can be reused.'
          );
        }
        const options = config.createResolver(config.chartOptionScopes(), this.getContext());
        this.platform = new (config.platform || _detectPlatform(initialCanvas))();
        this.platform.updateConfig(config);
        const context = this.platform.acquireContext(initialCanvas, options.aspectRatio);
        const canvas = context && context.canvas;
        const height = canvas && canvas.height;
        const width = canvas && canvas.width;
        this.id = uid();
        this.ctx = context;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this._options = options;
        this._aspectRatio = this.aspectRatio;
        this._layers = [];
        this._metasets = [];
        this._stacks = undefined;
        this.boxes = [];
        this.currentDevicePixelRatio = undefined;
        this.chartArea = undefined;
        this._active = [];
        this._lastEvent = undefined;
        this._listeners = {};
        this._responsiveListeners = undefined;
        this._sortedMetasets = [];
        this.scales = {};
        this._plugins = new PluginService();
        this.$proxies = {};
        this._hiddenIndices = {};
        this.attached = false;
        this._animationsDisabled = undefined;
        this.$context = undefined;
        this._doResize = debounce(mode => this.update(mode), options.resizeDelay || 0);
        this._dataChanges = [];
        instances[this.id] = this;
        if (!context || !canvas) {
          console.error("Failed to create chart: can't acquire context from the given item");
          return;
        }
        animator.listen(this, 'complete', onAnimationsComplete);
        animator.listen(this, 'progress', onAnimationProgress);
        this._initialize();
        if (this.attached) {
          this.update();
        }
      }
      get aspectRatio() {
        const {options: {aspectRatio, maintainAspectRatio}, width, height, _aspectRatio} = this;
        if (!isNullOrUndef(aspectRatio)) {
          return aspectRatio;
        }
        if (maintainAspectRatio && _aspectRatio) {
          return _aspectRatio;
        }
        return height ? width / height : null;
      }
      get data() {
        return this.config.data;
      }
      set data(data) {
        this.config.data = data;
      }
      get options() {
        return this._options;
      }
      set options(options) {
        this.config.options = options;
      }
      _initialize() {
        this.notifyPlugins('beforeInit');
        if (this.options.responsive) {
          this.resize();
        } else {
          retinaScale(this, this.options.devicePixelRatio);
        }
        this.bindEvents();
        this.notifyPlugins('afterInit');
        return this;
      }
      clear() {
        clearCanvas(this.canvas, this.ctx);
        return this;
      }
      stop() {
        animator.stop(this);
        return this;
      }
      resize(width, height) {
        if (!animator.running(this)) {
          this._resize(width, height);
        } else {
          this._resizeBeforeDraw = {width, height};
        }
      }
      _resize(width, height) {
        const options = this.options;
        const canvas = this.canvas;
        const aspectRatio = options.maintainAspectRatio && this.aspectRatio;
        const newSize = this.platform.getMaximumSize(canvas, width, height, aspectRatio);
        const newRatio = options.devicePixelRatio || this.platform.getDevicePixelRatio();
        const mode = this.width ? 'resize' : 'attach';
        this.width = newSize.width;
        this.height = newSize.height;
        this._aspectRatio = this.aspectRatio;
        if (!retinaScale(this, newRatio, true)) {
          return;
        }
        this.notifyPlugins('resize', {size: newSize});
        callback(options.onResize, [this, newSize], this);
        if (this.attached) {
          if (this._doResize(mode)) {
            this.render();
          }
        }
      }
      ensureScalesHaveIDs() {
        const options = this.options;
        const scalesOptions = options.scales || {};
        each(scalesOptions, (axisOptions, axisID) => {
          axisOptions.id = axisID;
        });
      }
      buildOrUpdateScales() {
        const options = this.options;
        const scaleOpts = options.scales;
        const scales = this.scales;
        const updated = Object.keys(scales).reduce((obj, id) => {
          obj[id] = false;
          return obj;
        }, {});
        let items = [];
        if (scaleOpts) {
          items = items.concat(
            Object.keys(scaleOpts).map((id) => {
              const scaleOptions = scaleOpts[id];
              const axis = determineAxis(id, scaleOptions);
              const isRadial = axis === 'r';
              const isHorizontal = axis === 'x';
              return {
                options: scaleOptions,
                dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
                dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
              };
            })
          );
        }
        each(items, (item) => {
          const scaleOptions = item.options;
          const id = scaleOptions.id;
          const axis = determineAxis(id, scaleOptions);
          const scaleType = valueOrDefault(scaleOptions.type, item.dtype);
          if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
            scaleOptions.position = item.dposition;
          }
          updated[id] = true;
          let scale = null;
          if (id in scales && scales[id].type === scaleType) {
            scale = scales[id];
          } else {
            const scaleClass = registry.getScale(scaleType);
            scale = new scaleClass({
              id,
              type: scaleType,
              ctx: this.ctx,
              chart: this
            });
            scales[scale.id] = scale;
          }
          scale.init(scaleOptions, options);
        });
        each(updated, (hasUpdated, id) => {
          if (!hasUpdated) {
            delete scales[id];
          }
        });
        each(scales, (scale) => {
          layouts.configure(this, scale, scale.options);
          layouts.addBox(this, scale);
        });
      }
      _updateMetasets() {
        const metasets = this._metasets;
        const numData = this.data.datasets.length;
        const numMeta = metasets.length;
        metasets.sort((a, b) => a.index - b.index);
        if (numMeta > numData) {
          for (let i = numData; i < numMeta; ++i) {
            this._destroyDatasetMeta(i);
          }
          metasets.splice(numData, numMeta - numData);
        }
        this._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
      }
      _removeUnreferencedMetasets() {
        const {_metasets: metasets, data: {datasets}} = this;
        if (metasets.length > datasets.length) {
          delete this._stacks;
        }
        metasets.forEach((meta, index) => {
          if (datasets.filter(x => x === meta._dataset).length === 0) {
            this._destroyDatasetMeta(index);
          }
        });
      }
      buildOrUpdateControllers() {
        const newControllers = [];
        const datasets = this.data.datasets;
        let i, ilen;
        this._removeUnreferencedMetasets();
        for (i = 0, ilen = datasets.length; i < ilen; i++) {
          const dataset = datasets[i];
          let meta = this.getDatasetMeta(i);
          const type = dataset.type || this.config.type;
          if (meta.type && meta.type !== type) {
            this._destroyDatasetMeta(i);
            meta = this.getDatasetMeta(i);
          }
          meta.type = type;
          meta.indexAxis = dataset.indexAxis || getIndexAxis(type, this.options);
          meta.order = dataset.order || 0;
          meta.index = i;
          meta.label = '' + dataset.label;
          meta.visible = this.isDatasetVisible(i);
          if (meta.controller) {
            meta.controller.updateIndex(i);
            meta.controller.linkScales();
          } else {
            const ControllerClass = registry.getController(type);
            const {datasetElementType, dataElementType} = defaults.datasets[type];
            Object.assign(ControllerClass.prototype, {
              dataElementType: registry.getElement(dataElementType),
              datasetElementType: datasetElementType && registry.getElement(datasetElementType)
            });
            meta.controller = new ControllerClass(this, i);
            newControllers.push(meta.controller);
          }
        }
        this._updateMetasets();
        return newControllers;
      }
      _resetElements() {
        each(this.data.datasets, (dataset, datasetIndex) => {
          this.getDatasetMeta(datasetIndex).controller.reset();
        }, this);
      }
      reset() {
        this._resetElements();
        this.notifyPlugins('reset');
      }
      update(mode) {
        const config = this.config;
        config.update();
        const options = this._options = config.createResolver(config.chartOptionScopes(), this.getContext());
        const animsDisabled = this._animationsDisabled = !options.animation;
        this._updateScales();
        this._checkEventBindings();
        this._updateHiddenIndices();
        this._plugins.invalidate();
        if (this.notifyPlugins('beforeUpdate', {mode, cancelable: true}) === false) {
          return;
        }
        const newControllers = this.buildOrUpdateControllers();
        this.notifyPlugins('beforeElementsUpdate');
        let minPadding = 0;
        for (let i = 0, ilen = this.data.datasets.length; i < ilen; i++) {
          const {controller} = this.getDatasetMeta(i);
          const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
          controller.buildOrUpdateElements(reset);
          minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
        }
        minPadding = this._minPadding = options.layout.autoPadding ? minPadding : 0;
        this._updateLayout(minPadding);
        if (!animsDisabled) {
          each(newControllers, (controller) => {
            controller.reset();
          });
        }
        this._updateDatasets(mode);
        this.notifyPlugins('afterUpdate', {mode});
        this._layers.sort(compare2Level('z', '_idx'));
        const {_active, _lastEvent} = this;
        if (_lastEvent) {
          this._eventHandler(_lastEvent, true);
        } else if (_active.length) {
          this._updateHoverStyles(_active, _active, true);
        }
        this.render();
      }
      _updateScales() {
        each(this.scales, (scale) => {
          layouts.removeBox(this, scale);
        });
        this.ensureScalesHaveIDs();
        this.buildOrUpdateScales();
      }
      _checkEventBindings() {
        const options = this.options;
        const existingEvents = new Set(Object.keys(this._listeners));
        const newEvents = new Set(options.events);
        if (!setsEqual(existingEvents, newEvents) || !!this._responsiveListeners !== options.responsive) {
          this.unbindEvents();
          this.bindEvents();
        }
      }
      _updateHiddenIndices() {
        const {_hiddenIndices} = this;
        const changes = this._getUniformDataChanges() || [];
        for (const {method, start, count} of changes) {
          const move = method === '_removeElements' ? -count : count;
          moveNumericKeys(_hiddenIndices, start, move);
        }
      }
      _getUniformDataChanges() {
        const _dataChanges = this._dataChanges;
        if (!_dataChanges || !_dataChanges.length) {
          return;
        }
        this._dataChanges = [];
        const datasetCount = this.data.datasets.length;
        const makeSet = (idx) => new Set(
          _dataChanges
            .filter(c => c[0] === idx)
            .map((c, i) => i + ',' + c.splice(1).join(','))
        );
        const changeSet = makeSet(0);
        for (let i = 1; i < datasetCount; i++) {
          if (!setsEqual(changeSet, makeSet(i))) {
            return;
          }
        }
        return Array.from(changeSet)
          .map(c => c.split(','))
          .map(a => ({method: a[1], start: +a[2], count: +a[3]}));
      }
      _updateLayout(minPadding) {
        if (this.notifyPlugins('beforeLayout', {cancelable: true}) === false) {
          return;
        }
        layouts.update(this, this.width, this.height, minPadding);
        const area = this.chartArea;
        const noArea = area.width <= 0 || area.height <= 0;
        this._layers = [];
        each(this.boxes, (box) => {
          if (noArea && box.position === 'chartArea') {
            return;
          }
          if (box.configure) {
            box.configure();
          }
          this._layers.push(...box._layers());
        }, this);
        this._layers.forEach((item, index) => {
          item._idx = index;
        });
        this.notifyPlugins('afterLayout');
      }
      _updateDatasets(mode) {
        if (this.notifyPlugins('beforeDatasetsUpdate', {mode, cancelable: true}) === false) {
          return;
        }
        for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
          this.getDatasetMeta(i).controller.configure();
        }
        for (let i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
          this._updateDataset(i, isFunction(mode) ? mode({datasetIndex: i}) : mode);
        }
        this.notifyPlugins('afterDatasetsUpdate', {mode});
      }
      _updateDataset(index, mode) {
        const meta = this.getDatasetMeta(index);
        const args = {meta, index, mode, cancelable: true};
        if (this.notifyPlugins('beforeDatasetUpdate', args) === false) {
          return;
        }
        meta.controller._update(mode);
        args.cancelable = false;
        this.notifyPlugins('afterDatasetUpdate', args);
      }
      render() {
        if (this.notifyPlugins('beforeRender', {cancelable: true}) === false) {
          return;
        }
        if (animator.has(this)) {
          if (this.attached && !animator.running(this)) {
            animator.start(this);
          }
        } else {
          this.draw();
          onAnimationsComplete({chart: this});
        }
      }
      draw() {
        let i;
        if (this._resizeBeforeDraw) {
          const {width, height} = this._resizeBeforeDraw;
          this._resize(width, height);
          this._resizeBeforeDraw = null;
        }
        this.clear();
        if (this.width <= 0 || this.height <= 0) {
          return;
        }
        if (this.notifyPlugins('beforeDraw', {cancelable: true}) === false) {
          return;
        }
        const layers = this._layers;
        for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
          layers[i].draw(this.chartArea);
        }
        this._drawDatasets();
        for (; i < layers.length; ++i) {
          layers[i].draw(this.chartArea);
        }
        this.notifyPlugins('afterDraw');
      }
      _getSortedDatasetMetas(filterVisible) {
        const metasets = this._sortedMetasets;
        const result = [];
        let i, ilen;
        for (i = 0, ilen = metasets.length; i < ilen; ++i) {
          const meta = metasets[i];
          if (!filterVisible || meta.visible) {
            result.push(meta);
          }
        }
        return result;
      }
      getSortedVisibleDatasetMetas() {
        return this._getSortedDatasetMetas(true);
      }
      _drawDatasets() {
        if (this.notifyPlugins('beforeDatasetsDraw', {cancelable: true}) === false) {
          return;
        }
        const metasets = this.getSortedVisibleDatasetMetas();
        for (let i = metasets.length - 1; i >= 0; --i) {
          this._drawDataset(metasets[i]);
        }
        this.notifyPlugins('afterDatasetsDraw');
      }
      _drawDataset(meta) {
        const ctx = this.ctx;
        const clip = meta._clip;
        const useClip = !clip.disabled;
        const area = this.chartArea;
        const args = {
          meta,
          index: meta.index,
          cancelable: true
        };
        if (this.notifyPlugins('beforeDatasetDraw', args) === false) {
          return;
        }
        if (useClip) {
          clipArea(ctx, {
            left: clip.left === false ? 0 : area.left - clip.left,
            right: clip.right === false ? this.width : area.right + clip.right,
            top: clip.top === false ? 0 : area.top - clip.top,
            bottom: clip.bottom === false ? this.height : area.bottom + clip.bottom
          });
        }
        meta.controller.draw();
        if (useClip) {
          unclipArea(ctx);
        }
        args.cancelable = false;
        this.notifyPlugins('afterDatasetDraw', args);
      }
      getElementsAtEventForMode(e, mode, options, useFinalPosition) {
        const method = Interaction.modes[mode];
        if (typeof method === 'function') {
          return method(this, e, options, useFinalPosition);
        }
        return [];
      }
      getDatasetMeta(datasetIndex) {
        const dataset = this.data.datasets[datasetIndex];
        const metasets = this._metasets;
        let meta = metasets.filter(x => x && x._dataset === dataset).pop();
        if (!meta) {
          meta = {
            type: null,
            data: [],
            dataset: null,
            controller: null,
            hidden: null,
            xAxisID: null,
            yAxisID: null,
            order: dataset && dataset.order || 0,
            index: datasetIndex,
            _dataset: dataset,
            _parsed: [],
            _sorted: false
          };
          metasets.push(meta);
        }
        return meta;
      }
      getContext() {
        return this.$context || (this.$context = createContext(null, {chart: this, type: 'chart'}));
      }
      getVisibleDatasetCount() {
        return this.getSortedVisibleDatasetMetas().length;
      }
      isDatasetVisible(datasetIndex) {
        const dataset = this.data.datasets[datasetIndex];
        if (!dataset) {
          return false;
        }
        const meta = this.getDatasetMeta(datasetIndex);
        return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
      }
      setDatasetVisibility(datasetIndex, visible) {
        const meta = this.getDatasetMeta(datasetIndex);
        meta.hidden = !visible;
      }
      toggleDataVisibility(index) {
        this._hiddenIndices[index] = !this._hiddenIndices[index];
      }
      getDataVisibility(index) {
        return !this._hiddenIndices[index];
      }
      _updateVisibility(datasetIndex, dataIndex, visible) {
        const mode = visible ? 'show' : 'hide';
        const meta = this.getDatasetMeta(datasetIndex);
        const anims = meta.controller._resolveAnimations(undefined, mode);
        if (defined(dataIndex)) {
          meta.data[dataIndex].hidden = !visible;
          this.update();
        } else {
          this.setDatasetVisibility(datasetIndex, visible);
          anims.update(meta, {visible});
          this.update((ctx) => ctx.datasetIndex === datasetIndex ? mode : undefined);
        }
      }
      hide(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, false);
      }
      show(datasetIndex, dataIndex) {
        this._updateVisibility(datasetIndex, dataIndex, true);
      }
      _destroyDatasetMeta(datasetIndex) {
        const meta = this._metasets[datasetIndex];
        if (meta && meta.controller) {
          meta.controller._destroy();
        }
        delete this._metasets[datasetIndex];
      }
      _stop() {
        let i, ilen;
        this.stop();
        animator.remove(this);
        for (i = 0, ilen = this.data.datasets.length; i < ilen; ++i) {
          this._destroyDatasetMeta(i);
        }
      }
      destroy() {
        this.notifyPlugins('beforeDestroy');
        const {canvas, ctx} = this;
        this._stop();
        this.config.clearCache();
        if (canvas) {
          this.unbindEvents();
          clearCanvas(canvas, ctx);
          this.platform.releaseContext(ctx);
          this.canvas = null;
          this.ctx = null;
        }
        this.notifyPlugins('destroy');
        delete instances[this.id];
        this.notifyPlugins('afterDestroy');
      }
      toBase64Image(...args) {
        return this.canvas.toDataURL(...args);
      }
      bindEvents() {
        this.bindUserEvents();
        if (this.options.responsive) {
          this.bindResponsiveEvents();
        } else {
          this.attached = true;
        }
      }
      bindUserEvents() {
        const listeners = this._listeners;
        const platform = this.platform;
        const _add = (type, listener) => {
          platform.addEventListener(this, type, listener);
          listeners[type] = listener;
        };
        const listener = (e, x, y) => {
          e.offsetX = x;
          e.offsetY = y;
          this._eventHandler(e);
        };
        each(this.options.events, (type) => _add(type, listener));
      }
      bindResponsiveEvents() {
        if (!this._responsiveListeners) {
          this._responsiveListeners = {};
        }
        const listeners = this._responsiveListeners;
        const platform = this.platform;
        const _add = (type, listener) => {
          platform.addEventListener(this, type, listener);
          listeners[type] = listener;
        };
        const _remove = (type, listener) => {
          if (listeners[type]) {
            platform.removeEventListener(this, type, listener);
            delete listeners[type];
          }
        };
        const listener = (width, height) => {
          if (this.canvas) {
            this.resize(width, height);
          }
        };
        let detached;
        const attached = () => {
          _remove('attach', attached);
          this.attached = true;
          this.resize();
          _add('resize', listener);
          _add('detach', detached);
        };
        detached = () => {
          this.attached = false;
          _remove('resize', listener);
          this._stop();
          this._resize(0, 0);
          _add('attach', attached);
        };
        if (platform.isAttached(this.canvas)) {
          attached();
        } else {
          detached();
        }
      }
      unbindEvents() {
        each(this._listeners, (listener, type) => {
          this.platform.removeEventListener(this, type, listener);
        });
        this._listeners = {};
        each(this._responsiveListeners, (listener, type) => {
          this.platform.removeEventListener(this, type, listener);
        });
        this._responsiveListeners = undefined;
      }
      updateHoverStyle(items, mode, enabled) {
        const prefix = enabled ? 'set' : 'remove';
        let meta, item, i, ilen;
        if (mode === 'dataset') {
          meta = this.getDatasetMeta(items[0].datasetIndex);
          meta.controller['_' + prefix + 'DatasetHoverStyle']();
        }
        for (i = 0, ilen = items.length; i < ilen; ++i) {
          item = items[i];
          const controller = item && this.getDatasetMeta(item.datasetIndex).controller;
          if (controller) {
            controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
          }
        }
      }
      getActiveElements() {
        return this._active || [];
      }
      setActiveElements(activeElements) {
        const lastActive = this._active || [];
        const active = activeElements.map(({datasetIndex, index}) => {
          const meta = this.getDatasetMeta(datasetIndex);
          if (!meta) {
            throw new Error('No dataset found at index ' + datasetIndex);
          }
          return {
            datasetIndex,
            element: meta.data[index],
            index,
          };
        });
        const changed = !_elementsEqual(active, lastActive);
        if (changed) {
          this._active = active;
          this._lastEvent = null;
          this._updateHoverStyles(active, lastActive);
        }
      }
      notifyPlugins(hook, args, filter) {
        return this._plugins.notify(this, hook, args, filter);
      }
      _updateHoverStyles(active, lastActive, replay) {
        const hoverOptions = this.options.hover;
        const diff = (a, b) => a.filter(x => !b.some(y => x.datasetIndex === y.datasetIndex && x.index === y.index));
        const deactivated = diff(lastActive, active);
        const activated = replay ? active : diff(active, lastActive);
        if (deactivated.length) {
          this.updateHoverStyle(deactivated, hoverOptions.mode, false);
        }
        if (activated.length && hoverOptions.mode) {
          this.updateHoverStyle(activated, hoverOptions.mode, true);
        }
      }
      _eventHandler(e, replay) {
        const args = {
          event: e,
          replay,
          cancelable: true,
          inChartArea: _isPointInArea(e, this.chartArea, this._minPadding)
        };
        const eventFilter = (plugin) => (plugin.options.events || this.options.events).includes(e.native.type);
        if (this.notifyPlugins('beforeEvent', args, eventFilter) === false) {
          return;
        }
        const changed = this._handleEvent(e, replay, args.inChartArea);
        args.cancelable = false;
        this.notifyPlugins('afterEvent', args, eventFilter);
        if (changed || args.changed) {
          this.render();
        }
        return this;
      }
      _handleEvent(e, replay, inChartArea) {
        const {_active: lastActive = [], options} = this;
        const useFinalPosition = replay;
        const active = this._getActiveElements(e, lastActive, inChartArea, useFinalPosition);
        const isClick = _isClickEvent(e);
        const lastEvent = determineLastEvent(e, this._lastEvent, inChartArea, isClick);
        if (inChartArea) {
          this._lastEvent = null;
          callback(options.onHover, [e, active, this], this);
          if (isClick) {
            callback(options.onClick, [e, active, this], this);
          }
        }
        const changed = !_elementsEqual(active, lastActive);
        if (changed || replay) {
          this._active = active;
          this._updateHoverStyles(active, lastActive, replay);
        }
        this._lastEvent = lastEvent;
        return changed;
      }
      _getActiveElements(e, lastActive, inChartArea, useFinalPosition) {
        if (e.type === 'mouseout') {
          return [];
        }
        if (!inChartArea) {
          return lastActive;
        }
        const hoverOptions = this.options.hover;
        return this.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
      }
    }
    const invalidatePlugins = () => each(Chart.instances, (chart) => chart._plugins.invalidate());
    const enumerable = true;
    Object.defineProperties(Chart, {
      defaults: {
        enumerable,
        value: defaults
      },
      instances: {
        enumerable,
        value: instances
      },
      overrides: {
        enumerable,
        value: overrides
      },
      registry: {
        enumerable,
        value: registry
      },
      version: {
        enumerable,
        value: version
      },
      getChart: {
        enumerable,
        value: getChart
      },
      register: {
        enumerable,
        value: (...items) => {
          registry.add(...items);
          invalidatePlugins();
        }
      },
      unregister: {
        enumerable,
        value: (...items) => {
          registry.remove(...items);
          invalidatePlugins();
        }
      }
    });

    function clipArc(ctx, element, endAngle) {
      const {startAngle, pixelMargin, x, y, outerRadius, innerRadius} = element;
      let angleMargin = pixelMargin / outerRadius;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);
      if (innerRadius > pixelMargin) {
        angleMargin = pixelMargin / innerRadius;
        ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
      } else {
        ctx.arc(x, y, pixelMargin, endAngle + HALF_PI, startAngle - HALF_PI);
      }
      ctx.closePath();
      ctx.clip();
    }
    function toRadiusCorners(value) {
      return _readValueToProps(value, ['outerStart', 'outerEnd', 'innerStart', 'innerEnd']);
    }
    function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
      const o = toRadiusCorners(arc.options.borderRadius);
      const halfThickness = (outerRadius - innerRadius) / 2;
      const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);
      const computeOuterLimit = (val) => {
        const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
        return _limitValue(val, 0, Math.min(halfThickness, outerArcLimit));
      };
      return {
        outerStart: computeOuterLimit(o.outerStart),
        outerEnd: computeOuterLimit(o.outerEnd),
        innerStart: _limitValue(o.innerStart, 0, innerLimit),
        innerEnd: _limitValue(o.innerEnd, 0, innerLimit),
      };
    }
    function rThetaToXY(r, theta, x, y) {
      return {
        x: x + r * Math.cos(theta),
        y: y + r * Math.sin(theta),
      };
    }
    function pathArc(ctx, element, offset, spacing, end) {
      const {x, y, startAngle: start, pixelMargin, innerRadius: innerR} = element;
      const outerRadius = Math.max(element.outerRadius + spacing + offset - pixelMargin, 0);
      const innerRadius = innerR > 0 ? innerR + spacing + offset + pixelMargin : 0;
      let spacingOffset = 0;
      const alpha = end - start;
      if (spacing) {
        const noSpacingInnerRadius = innerR > 0 ? innerR - spacing : 0;
        const noSpacingOuterRadius = outerRadius > 0 ? outerRadius - spacing : 0;
        const avNogSpacingRadius = (noSpacingInnerRadius + noSpacingOuterRadius) / 2;
        const adjustedAngle = avNogSpacingRadius !== 0 ? (alpha * avNogSpacingRadius) / (avNogSpacingRadius + spacing) : alpha;
        spacingOffset = (alpha - adjustedAngle) / 2;
      }
      const beta = Math.max(0.001, alpha * outerRadius - offset / PI) / outerRadius;
      const angleOffset = (alpha - beta) / 2;
      const startAngle = start + angleOffset + spacingOffset;
      const endAngle = end - angleOffset - spacingOffset;
      const {outerStart, outerEnd, innerStart, innerEnd} = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
      const outerStartAdjustedRadius = outerRadius - outerStart;
      const outerEndAdjustedRadius = outerRadius - outerEnd;
      const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
      const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
      const innerStartAdjustedRadius = innerRadius + innerStart;
      const innerEndAdjustedRadius = innerRadius + innerEnd;
      const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
      const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerEndAdjustedAngle);
      if (outerEnd > 0) {
        const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
        ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + HALF_PI);
      }
      const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
      ctx.lineTo(p4.x, p4.y);
      if (innerEnd > 0) {
        const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
        ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + HALF_PI, innerEndAdjustedAngle + Math.PI);
      }
      ctx.arc(x, y, innerRadius, endAngle - (innerEnd / innerRadius), startAngle + (innerStart / innerRadius), true);
      if (innerStart > 0) {
        const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
        ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - HALF_PI);
      }
      const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
      ctx.lineTo(p8.x, p8.y);
      if (outerStart > 0) {
        const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
        ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - HALF_PI, outerStartAdjustedAngle);
      }
      ctx.closePath();
    }
    function drawArc(ctx, element, offset, spacing) {
      const {fullCircles, startAngle, circumference} = element;
      let endAngle = element.endAngle;
      if (fullCircles) {
        pathArc(ctx, element, offset, spacing, startAngle + TAU);
        for (let i = 0; i < fullCircles; ++i) {
          ctx.fill();
        }
        if (!isNaN(circumference)) {
          endAngle = startAngle + circumference % TAU;
          if (circumference % TAU === 0) {
            endAngle += TAU;
          }
        }
      }
      pathArc(ctx, element, offset, spacing, endAngle);
      ctx.fill();
      return endAngle;
    }
    function drawFullCircleBorders(ctx, element, inner) {
      const {x, y, startAngle, pixelMargin, fullCircles} = element;
      const outerRadius = Math.max(element.outerRadius - pixelMargin, 0);
      const innerRadius = element.innerRadius + pixelMargin;
      let i;
      if (inner) {
        clipArc(ctx, element, startAngle + TAU);
      }
      ctx.beginPath();
      ctx.arc(x, y, innerRadius, startAngle + TAU, startAngle, true);
      for (i = 0; i < fullCircles; ++i) {
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(x, y, outerRadius, startAngle, startAngle + TAU);
      for (i = 0; i < fullCircles; ++i) {
        ctx.stroke();
      }
    }
    function drawBorder(ctx, element, offset, spacing, endAngle) {
      const {options} = element;
      const {borderWidth, borderJoinStyle} = options;
      const inner = options.borderAlign === 'inner';
      if (!borderWidth) {
        return;
      }
      if (inner) {
        ctx.lineWidth = borderWidth * 2;
        ctx.lineJoin = borderJoinStyle || 'round';
      } else {
        ctx.lineWidth = borderWidth;
        ctx.lineJoin = borderJoinStyle || 'bevel';
      }
      if (element.fullCircles) {
        drawFullCircleBorders(ctx, element, inner);
      }
      if (inner) {
        clipArc(ctx, element, endAngle);
      }
      pathArc(ctx, element, offset, spacing, endAngle);
      ctx.stroke();
    }
    class ArcElement extends Element {
      constructor(cfg) {
        super();
        this.options = undefined;
        this.circumference = undefined;
        this.startAngle = undefined;
        this.endAngle = undefined;
        this.innerRadius = undefined;
        this.outerRadius = undefined;
        this.pixelMargin = 0;
        this.fullCircles = 0;
        if (cfg) {
          Object.assign(this, cfg);
        }
      }
      inRange(chartX, chartY, useFinalPosition) {
        const point = this.getProps(['x', 'y'], useFinalPosition);
        const {angle, distance} = getAngleFromPoint(point, {x: chartX, y: chartY});
        const {startAngle, endAngle, innerRadius, outerRadius, circumference} = this.getProps([
          'startAngle',
          'endAngle',
          'innerRadius',
          'outerRadius',
          'circumference'
        ], useFinalPosition);
        const rAdjust = this.options.spacing / 2;
        const _circumference = valueOrDefault(circumference, endAngle - startAngle);
        const betweenAngles = _circumference >= TAU || _angleBetween(angle, startAngle, endAngle);
        const withinRadius = _isBetween(distance, innerRadius + rAdjust, outerRadius + rAdjust);
        return (betweenAngles && withinRadius);
      }
      getCenterPoint(useFinalPosition) {
        const {x, y, startAngle, endAngle, innerRadius, outerRadius} = this.getProps([
          'x',
          'y',
          'startAngle',
          'endAngle',
          'innerRadius',
          'outerRadius',
          'circumference',
        ], useFinalPosition);
        const {offset, spacing} = this.options;
        const halfAngle = (startAngle + endAngle) / 2;
        const halfRadius = (innerRadius + outerRadius + spacing + offset) / 2;
        return {
          x: x + Math.cos(halfAngle) * halfRadius,
          y: y + Math.sin(halfAngle) * halfRadius
        };
      }
      tooltipPosition(useFinalPosition) {
        return this.getCenterPoint(useFinalPosition);
      }
      draw(ctx) {
        const {options, circumference} = this;
        const offset = (options.offset || 0) / 2;
        const spacing = (options.spacing || 0) / 2;
        this.pixelMargin = (options.borderAlign === 'inner') ? 0.33 : 0;
        this.fullCircles = circumference > TAU ? Math.floor(circumference / TAU) : 0;
        if (circumference === 0 || this.innerRadius < 0 || this.outerRadius < 0) {
          return;
        }
        ctx.save();
        let radiusOffset = 0;
        if (offset) {
          radiusOffset = offset / 2;
          const halfAngle = (this.startAngle + this.endAngle) / 2;
          ctx.translate(Math.cos(halfAngle) * radiusOffset, Math.sin(halfAngle) * radiusOffset);
          if (this.circumference >= PI) {
            radiusOffset = offset;
          }
        }
        ctx.fillStyle = options.backgroundColor;
        ctx.strokeStyle = options.borderColor;
        const endAngle = drawArc(ctx, this, radiusOffset, spacing);
        drawBorder(ctx, this, radiusOffset, spacing, endAngle);
        ctx.restore();
      }
    }
    ArcElement.id = 'arc';
    ArcElement.defaults = {
      borderAlign: 'center',
      borderColor: '#fff',
      borderJoinStyle: undefined,
      borderRadius: 0,
      borderWidth: 2,
      offset: 0,
      spacing: 0,
      angle: undefined,
    };
    ArcElement.defaultRoutes = {
      backgroundColor: 'backgroundColor'
    };

    function setStyle(ctx, options, style = options) {
      ctx.lineCap = valueOrDefault(style.borderCapStyle, options.borderCapStyle);
      ctx.setLineDash(valueOrDefault(style.borderDash, options.borderDash));
      ctx.lineDashOffset = valueOrDefault(style.borderDashOffset, options.borderDashOffset);
      ctx.lineJoin = valueOrDefault(style.borderJoinStyle, options.borderJoinStyle);
      ctx.lineWidth = valueOrDefault(style.borderWidth, options.borderWidth);
      ctx.strokeStyle = valueOrDefault(style.borderColor, options.borderColor);
    }
    function lineTo(ctx, previous, target) {
      ctx.lineTo(target.x, target.y);
    }
    function getLineMethod(options) {
      if (options.stepped) {
        return _steppedLineTo;
      }
      if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return _bezierCurveTo;
      }
      return lineTo;
    }
    function pathVars(points, segment, params = {}) {
      const count = points.length;
      const {start: paramsStart = 0, end: paramsEnd = count - 1} = params;
      const {start: segmentStart, end: segmentEnd} = segment;
      const start = Math.max(paramsStart, segmentStart);
      const end = Math.min(paramsEnd, segmentEnd);
      const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
      return {
        count,
        start,
        loop: segment.loop,
        ilen: end < start && !outside ? count + end - start : end - start
      };
    }
    function pathSegment(ctx, line, segment, params) {
      const {points, options} = line;
      const {count, start, loop, ilen} = pathVars(points, segment, params);
      const lineMethod = getLineMethod(options);
      let {move = true, reverse} = params || {};
      let i, point, prev;
      for (i = 0; i <= ilen; ++i) {
        point = points[(start + (reverse ? ilen - i : i)) % count];
        if (point.skip) {
          continue;
        } else if (move) {
          ctx.moveTo(point.x, point.y);
          move = false;
        } else {
          lineMethod(ctx, prev, point, reverse, options.stepped);
        }
        prev = point;
      }
      if (loop) {
        point = points[(start + (reverse ? ilen : 0)) % count];
        lineMethod(ctx, prev, point, reverse, options.stepped);
      }
      return !!loop;
    }
    function fastPathSegment(ctx, line, segment, params) {
      const points = line.points;
      const {count, start, ilen} = pathVars(points, segment, params);
      const {move = true, reverse} = params || {};
      let avgX = 0;
      let countX = 0;
      let i, point, prevX, minY, maxY, lastY;
      const pointIndex = (index) => (start + (reverse ? ilen - index : index)) % count;
      const drawX = () => {
        if (minY !== maxY) {
          ctx.lineTo(avgX, maxY);
          ctx.lineTo(avgX, minY);
          ctx.lineTo(avgX, lastY);
        }
      };
      if (move) {
        point = points[pointIndex(0)];
        ctx.moveTo(point.x, point.y);
      }
      for (i = 0; i <= ilen; ++i) {
        point = points[pointIndex(i)];
        if (point.skip) {
          continue;
        }
        const x = point.x;
        const y = point.y;
        const truncX = x | 0;
        if (truncX === prevX) {
          if (y < minY) {
            minY = y;
          } else if (y > maxY) {
            maxY = y;
          }
          avgX = (countX * avgX + x) / ++countX;
        } else {
          drawX();
          ctx.lineTo(x, y);
          prevX = truncX;
          countX = 0;
          minY = maxY = y;
        }
        lastY = y;
      }
      drawX();
    }
    function _getSegmentMethod(line) {
      const opts = line.options;
      const borderDash = opts.borderDash && opts.borderDash.length;
      const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
      return useFastPath ? fastPathSegment : pathSegment;
    }
    function _getInterpolationMethod(options) {
      if (options.stepped) {
        return _steppedInterpolation;
      }
      if (options.tension || options.cubicInterpolationMode === 'monotone') {
        return _bezierInterpolation;
      }
      return _pointInLine;
    }
    function strokePathWithCache(ctx, line, start, count) {
      let path = line._path;
      if (!path) {
        path = line._path = new Path2D();
        if (line.path(path, start, count)) {
          path.closePath();
        }
      }
      setStyle(ctx, line.options);
      ctx.stroke(path);
    }
    function strokePathDirect(ctx, line, start, count) {
      const {segments, options} = line;
      const segmentMethod = _getSegmentMethod(line);
      for (const segment of segments) {
        setStyle(ctx, options, segment.style);
        ctx.beginPath();
        if (segmentMethod(ctx, line, segment, {start, end: start + count - 1})) {
          ctx.closePath();
        }
        ctx.stroke();
      }
    }
    const usePath2D = typeof Path2D === 'function';
    function draw(ctx, line, start, count) {
      if (usePath2D && !line.options.segment) {
        strokePathWithCache(ctx, line, start, count);
      } else {
        strokePathDirect(ctx, line, start, count);
      }
    }
    class LineElement extends Element {
      constructor(cfg) {
        super();
        this.animated = true;
        this.options = undefined;
        this._chart = undefined;
        this._loop = undefined;
        this._fullLoop = undefined;
        this._path = undefined;
        this._points = undefined;
        this._segments = undefined;
        this._decimated = false;
        this._pointsUpdated = false;
        this._datasetIndex = undefined;
        if (cfg) {
          Object.assign(this, cfg);
        }
      }
      updateControlPoints(chartArea, indexAxis) {
        const options = this.options;
        if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !this._pointsUpdated) {
          const loop = options.spanGaps ? this._loop : this._fullLoop;
          _updateBezierControlPoints(this._points, options, chartArea, loop, indexAxis);
          this._pointsUpdated = true;
        }
      }
      set points(points) {
        this._points = points;
        delete this._segments;
        delete this._path;
        this._pointsUpdated = false;
      }
      get points() {
        return this._points;
      }
      get segments() {
        return this._segments || (this._segments = _computeSegments(this, this.options.segment));
      }
      first() {
        const segments = this.segments;
        const points = this.points;
        return segments.length && points[segments[0].start];
      }
      last() {
        const segments = this.segments;
        const points = this.points;
        const count = segments.length;
        return count && points[segments[count - 1].end];
      }
      interpolate(point, property) {
        const options = this.options;
        const value = point[property];
        const points = this.points;
        const segments = _boundSegments(this, {property, start: value, end: value});
        if (!segments.length) {
          return;
        }
        const result = [];
        const _interpolate = _getInterpolationMethod(options);
        let i, ilen;
        for (i = 0, ilen = segments.length; i < ilen; ++i) {
          const {start, end} = segments[i];
          const p1 = points[start];
          const p2 = points[end];
          if (p1 === p2) {
            result.push(p1);
            continue;
          }
          const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));
          const interpolated = _interpolate(p1, p2, t, options.stepped);
          interpolated[property] = point[property];
          result.push(interpolated);
        }
        return result.length === 1 ? result[0] : result;
      }
      pathSegment(ctx, segment, params) {
        const segmentMethod = _getSegmentMethod(this);
        return segmentMethod(ctx, this, segment, params);
      }
      path(ctx, start, count) {
        const segments = this.segments;
        const segmentMethod = _getSegmentMethod(this);
        let loop = this._loop;
        start = start || 0;
        count = count || (this.points.length - start);
        for (const segment of segments) {
          loop &= segmentMethod(ctx, this, segment, {start, end: start + count - 1});
        }
        return !!loop;
      }
      draw(ctx, chartArea, start, count) {
        const options = this.options || {};
        const points = this.points || [];
        if (points.length && options.borderWidth) {
          ctx.save();
          draw(ctx, this, start, count);
          ctx.restore();
        }
        if (this.animated) {
          this._pointsUpdated = false;
          this._path = undefined;
        }
      }
    }
    LineElement.id = 'line';
    LineElement.defaults = {
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0,
      borderJoinStyle: 'miter',
      borderWidth: 3,
      capBezierPoints: true,
      cubicInterpolationMode: 'default',
      fill: false,
      spanGaps: false,
      stepped: false,
      tension: 0,
    };
    LineElement.defaultRoutes = {
      backgroundColor: 'backgroundColor',
      borderColor: 'borderColor'
    };
    LineElement.descriptors = {
      _scriptable: true,
      _indexable: (name) => name !== 'borderDash' && name !== 'fill',
    };

    function inRange$1(el, pos, axis, useFinalPosition) {
      const options = el.options;
      const {[axis]: value} = el.getProps([axis], useFinalPosition);
      return (Math.abs(pos - value) < options.radius + options.hitRadius);
    }
    class PointElement extends Element {
      constructor(cfg) {
        super();
        this.options = undefined;
        this.parsed = undefined;
        this.skip = undefined;
        this.stop = undefined;
        if (cfg) {
          Object.assign(this, cfg);
        }
      }
      inRange(mouseX, mouseY, useFinalPosition) {
        const options = this.options;
        const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
        return ((Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2)) < Math.pow(options.hitRadius + options.radius, 2));
      }
      inXRange(mouseX, useFinalPosition) {
        return inRange$1(this, mouseX, 'x', useFinalPosition);
      }
      inYRange(mouseY, useFinalPosition) {
        return inRange$1(this, mouseY, 'y', useFinalPosition);
      }
      getCenterPoint(useFinalPosition) {
        const {x, y} = this.getProps(['x', 'y'], useFinalPosition);
        return {x, y};
      }
      size(options) {
        options = options || this.options || {};
        let radius = options.radius || 0;
        radius = Math.max(radius, radius && options.hoverRadius || 0);
        const borderWidth = radius && options.borderWidth || 0;
        return (radius + borderWidth) * 2;
      }
      draw(ctx, area) {
        const options = this.options;
        if (this.skip || options.radius < 0.1 || !_isPointInArea(this, area, this.size(options) / 2)) {
          return;
        }
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.fillStyle = options.backgroundColor;
        drawPoint(ctx, options, this.x, this.y);
      }
      getRange() {
        const options = this.options || {};
        return options.radius + options.hitRadius;
      }
    }
    PointElement.id = 'point';
    PointElement.defaults = {
      borderWidth: 1,
      hitRadius: 1,
      hoverBorderWidth: 1,
      hoverRadius: 4,
      pointStyle: 'circle',
      radius: 3,
      rotation: 0
    };
    PointElement.defaultRoutes = {
      backgroundColor: 'backgroundColor',
      borderColor: 'borderColor'
    };

    function getBarBounds(bar, useFinalPosition) {
      const {x, y, base, width, height} = bar.getProps(['x', 'y', 'base', 'width', 'height'], useFinalPosition);
      let left, right, top, bottom, half;
      if (bar.horizontal) {
        half = height / 2;
        left = Math.min(x, base);
        right = Math.max(x, base);
        top = y - half;
        bottom = y + half;
      } else {
        half = width / 2;
        left = x - half;
        right = x + half;
        top = Math.min(y, base);
        bottom = Math.max(y, base);
      }
      return {left, top, right, bottom};
    }
    function skipOrLimit(skip, value, min, max) {
      return skip ? 0 : _limitValue(value, min, max);
    }
    function parseBorderWidth(bar, maxW, maxH) {
      const value = bar.options.borderWidth;
      const skip = bar.borderSkipped;
      const o = toTRBL(value);
      return {
        t: skipOrLimit(skip.top, o.top, 0, maxH),
        r: skipOrLimit(skip.right, o.right, 0, maxW),
        b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
        l: skipOrLimit(skip.left, o.left, 0, maxW)
      };
    }
    function parseBorderRadius(bar, maxW, maxH) {
      const {enableBorderRadius} = bar.getProps(['enableBorderRadius']);
      const value = bar.options.borderRadius;
      const o = toTRBLCorners(value);
      const maxR = Math.min(maxW, maxH);
      const skip = bar.borderSkipped;
      const enableBorder = enableBorderRadius || isObject(value);
      return {
        topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
        topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
        bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
        bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
      };
    }
    function boundingRects(bar) {
      const bounds = getBarBounds(bar);
      const width = bounds.right - bounds.left;
      const height = bounds.bottom - bounds.top;
      const border = parseBorderWidth(bar, width / 2, height / 2);
      const radius = parseBorderRadius(bar, width / 2, height / 2);
      return {
        outer: {
          x: bounds.left,
          y: bounds.top,
          w: width,
          h: height,
          radius
        },
        inner: {
          x: bounds.left + border.l,
          y: bounds.top + border.t,
          w: width - border.l - border.r,
          h: height - border.t - border.b,
          radius: {
            topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
            topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
            bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
            bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r)),
          }
        }
      };
    }
    function inRange(bar, x, y, useFinalPosition) {
      const skipX = x === null;
      const skipY = y === null;
      const skipBoth = skipX && skipY;
      const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
      return bounds
    		&& (skipX || _isBetween(x, bounds.left, bounds.right))
    		&& (skipY || _isBetween(y, bounds.top, bounds.bottom));
    }
    function hasRadius(radius) {
      return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
    }
    function addNormalRectPath(ctx, rect) {
      ctx.rect(rect.x, rect.y, rect.w, rect.h);
    }
    function inflateRect(rect, amount, refRect = {}) {
      const x = rect.x !== refRect.x ? -amount : 0;
      const y = rect.y !== refRect.y ? -amount : 0;
      const w = (rect.x + rect.w !== refRect.x + refRect.w ? amount : 0) - x;
      const h = (rect.y + rect.h !== refRect.y + refRect.h ? amount : 0) - y;
      return {
        x: rect.x + x,
        y: rect.y + y,
        w: rect.w + w,
        h: rect.h + h,
        radius: rect.radius
      };
    }
    class BarElement extends Element {
      constructor(cfg) {
        super();
        this.options = undefined;
        this.horizontal = undefined;
        this.base = undefined;
        this.width = undefined;
        this.height = undefined;
        this.inflateAmount = undefined;
        if (cfg) {
          Object.assign(this, cfg);
        }
      }
      draw(ctx) {
        const {inflateAmount, options: {borderColor, backgroundColor}} = this;
        const {inner, outer} = boundingRects(this);
        const addRectPath = hasRadius(outer.radius) ? addRoundedRectPath : addNormalRectPath;
        ctx.save();
        if (outer.w !== inner.w || outer.h !== inner.h) {
          ctx.beginPath();
          addRectPath(ctx, inflateRect(outer, inflateAmount, inner));
          ctx.clip();
          addRectPath(ctx, inflateRect(inner, -inflateAmount, outer));
          ctx.fillStyle = borderColor;
          ctx.fill('evenodd');
        }
        ctx.beginPath();
        addRectPath(ctx, inflateRect(inner, inflateAmount));
        ctx.fillStyle = backgroundColor;
        ctx.fill();
        ctx.restore();
      }
      inRange(mouseX, mouseY, useFinalPosition) {
        return inRange(this, mouseX, mouseY, useFinalPosition);
      }
      inXRange(mouseX, useFinalPosition) {
        return inRange(this, mouseX, null, useFinalPosition);
      }
      inYRange(mouseY, useFinalPosition) {
        return inRange(this, null, mouseY, useFinalPosition);
      }
      getCenterPoint(useFinalPosition) {
        const {x, y, base, horizontal} = this.getProps(['x', 'y', 'base', 'horizontal'], useFinalPosition);
        return {
          x: horizontal ? (x + base) / 2 : x,
          y: horizontal ? y : (y + base) / 2
        };
      }
      getRange(axis) {
        return axis === 'x' ? this.width / 2 : this.height / 2;
      }
    }
    BarElement.id = 'bar';
    BarElement.defaults = {
      borderSkipped: 'start',
      borderWidth: 0,
      borderRadius: 0,
      inflateAmount: 'auto',
      pointStyle: undefined
    };
    BarElement.defaultRoutes = {
      backgroundColor: 'backgroundColor',
      borderColor: 'borderColor'
    };

    function lttbDecimation(data, start, count, availableWidth, options) {
      const samples = options.samples || availableWidth;
      if (samples >= count) {
        return data.slice(start, start + count);
      }
      const decimated = [];
      const bucketWidth = (count - 2) / (samples - 2);
      let sampledIndex = 0;
      const endIndex = start + count - 1;
      let a = start;
      let i, maxAreaPoint, maxArea, area, nextA;
      decimated[sampledIndex++] = data[a];
      for (i = 0; i < samples - 2; i++) {
        let avgX = 0;
        let avgY = 0;
        let j;
        const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
        const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
        const avgRangeLength = avgRangeEnd - avgRangeStart;
        for (j = avgRangeStart; j < avgRangeEnd; j++) {
          avgX += data[j].x;
          avgY += data[j].y;
        }
        avgX /= avgRangeLength;
        avgY /= avgRangeLength;
        const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
        const rangeTo = Math.min(Math.floor((i + 1) * bucketWidth) + 1, count) + start;
        const {x: pointAx, y: pointAy} = data[a];
        maxArea = area = -1;
        for (j = rangeOffs; j < rangeTo; j++) {
          area = 0.5 * Math.abs(
            (pointAx - avgX) * (data[j].y - pointAy) -
            (pointAx - data[j].x) * (avgY - pointAy)
          );
          if (area > maxArea) {
            maxArea = area;
            maxAreaPoint = data[j];
            nextA = j;
          }
        }
        decimated[sampledIndex++] = maxAreaPoint;
        a = nextA;
      }
      decimated[sampledIndex++] = data[endIndex];
      return decimated;
    }
    function minMaxDecimation(data, start, count, availableWidth) {
      let avgX = 0;
      let countX = 0;
      let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
      const decimated = [];
      const endIndex = start + count - 1;
      const xMin = data[start].x;
      const xMax = data[endIndex].x;
      const dx = xMax - xMin;
      for (i = start; i < start + count; ++i) {
        point = data[i];
        x = (point.x - xMin) / dx * availableWidth;
        y = point.y;
        const truncX = x | 0;
        if (truncX === prevX) {
          if (y < minY) {
            minY = y;
            minIndex = i;
          } else if (y > maxY) {
            maxY = y;
            maxIndex = i;
          }
          avgX = (countX * avgX + point.x) / ++countX;
        } else {
          const lastIndex = i - 1;
          if (!isNullOrUndef(minIndex) && !isNullOrUndef(maxIndex)) {
            const intermediateIndex1 = Math.min(minIndex, maxIndex);
            const intermediateIndex2 = Math.max(minIndex, maxIndex);
            if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
              decimated.push({
                ...data[intermediateIndex1],
                x: avgX,
              });
            }
            if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
              decimated.push({
                ...data[intermediateIndex2],
                x: avgX
              });
            }
          }
          if (i > 0 && lastIndex !== startIndex) {
            decimated.push(data[lastIndex]);
          }
          decimated.push(point);
          prevX = truncX;
          countX = 0;
          minY = maxY = y;
          minIndex = maxIndex = startIndex = i;
        }
      }
      return decimated;
    }
    function cleanDecimatedDataset(dataset) {
      if (dataset._decimated) {
        const data = dataset._data;
        delete dataset._decimated;
        delete dataset._data;
        Object.defineProperty(dataset, 'data', {value: data});
      }
    }
    function cleanDecimatedData(chart) {
      chart.data.datasets.forEach((dataset) => {
        cleanDecimatedDataset(dataset);
      });
    }
    function getStartAndCountOfVisiblePointsSimplified(meta, points) {
      const pointCount = points.length;
      let start = 0;
      let count;
      const {iScale} = meta;
      const {min, max, minDefined, maxDefined} = iScale.getUserBounds();
      if (minDefined) {
        start = _limitValue(_lookupByKey(points, iScale.axis, min).lo, 0, pointCount - 1);
      }
      if (maxDefined) {
        count = _limitValue(_lookupByKey(points, iScale.axis, max).hi + 1, start, pointCount) - start;
      } else {
        count = pointCount - start;
      }
      return {start, count};
    }
    var plugin_decimation = {
      id: 'decimation',
      defaults: {
        algorithm: 'min-max',
        enabled: false,
      },
      beforeElementsUpdate: (chart, args, options) => {
        if (!options.enabled) {
          cleanDecimatedData(chart);
          return;
        }
        const availableWidth = chart.width;
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          const {_data, indexAxis} = dataset;
          const meta = chart.getDatasetMeta(datasetIndex);
          const data = _data || dataset.data;
          if (resolve([indexAxis, chart.options.indexAxis]) === 'y') {
            return;
          }
          if (meta.type !== 'line') {
            return;
          }
          const xAxis = chart.scales[meta.xAxisID];
          if (xAxis.type !== 'linear' && xAxis.type !== 'time') {
            return;
          }
          if (chart.options.parsing) {
            return;
          }
          let {start, count} = getStartAndCountOfVisiblePointsSimplified(meta, data);
          const threshold = options.threshold || 4 * availableWidth;
          if (count <= threshold) {
            cleanDecimatedDataset(dataset);
            return;
          }
          if (isNullOrUndef(_data)) {
            dataset._data = data;
            delete dataset.data;
            Object.defineProperty(dataset, 'data', {
              configurable: true,
              enumerable: true,
              get: function() {
                return this._decimated;
              },
              set: function(d) {
                this._data = d;
              }
            });
          }
          let decimated;
          switch (options.algorithm) {
          case 'lttb':
            decimated = lttbDecimation(data, start, count, availableWidth, options);
            break;
          case 'min-max':
            decimated = minMaxDecimation(data, start, count, availableWidth);
            break;
          default:
            throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
          }
          dataset._decimated = decimated;
        });
      },
      destroy(chart) {
        cleanDecimatedData(chart);
      }
    };

    function getLineByIndex(chart, index) {
      const meta = chart.getDatasetMeta(index);
      const visible = meta && chart.isDatasetVisible(index);
      return visible ? meta.dataset : null;
    }
    function parseFillOption(line) {
      const options = line.options;
      const fillOption = options.fill;
      let fill = valueOrDefault(fillOption && fillOption.target, fillOption);
      if (fill === undefined) {
        fill = !!options.backgroundColor;
      }
      if (fill === false || fill === null) {
        return false;
      }
      if (fill === true) {
        return 'origin';
      }
      return fill;
    }
    function decodeFill(line, index, count) {
      const fill = parseFillOption(line);
      if (isObject(fill)) {
        return isNaN(fill.value) ? false : fill;
      }
      let target = parseFloat(fill);
      if (isNumberFinite(target) && Math.floor(target) === target) {
        if (fill[0] === '-' || fill[0] === '+') {
          target = index + target;
        }
        if (target === index || target < 0 || target >= count) {
          return false;
        }
        return target;
      }
      return ['origin', 'start', 'end', 'stack', 'shape'].indexOf(fill) >= 0 && fill;
    }
    function computeLinearBoundary(source) {
      const {scale = {}, fill} = source;
      let target = null;
      let horizontal;
      if (fill === 'start') {
        target = scale.bottom;
      } else if (fill === 'end') {
        target = scale.top;
      } else if (isObject(fill)) {
        target = scale.getPixelForValue(fill.value);
      } else if (scale.getBasePixel) {
        target = scale.getBasePixel();
      }
      if (isNumberFinite(target)) {
        horizontal = scale.isHorizontal();
        return {
          x: horizontal ? target : null,
          y: horizontal ? null : target
        };
      }
      return null;
    }
    class simpleArc {
      constructor(opts) {
        this.x = opts.x;
        this.y = opts.y;
        this.radius = opts.radius;
      }
      pathSegment(ctx, bounds, opts) {
        const {x, y, radius} = this;
        bounds = bounds || {start: 0, end: TAU};
        ctx.arc(x, y, radius, bounds.end, bounds.start, true);
        return !opts.bounds;
      }
      interpolate(point) {
        const {x, y, radius} = this;
        const angle = point.angle;
        return {
          x: x + Math.cos(angle) * radius,
          y: y + Math.sin(angle) * radius,
          angle
        };
      }
    }
    function computeCircularBoundary(source) {
      const {scale, fill} = source;
      const options = scale.options;
      const length = scale.getLabels().length;
      const target = [];
      const start = options.reverse ? scale.max : scale.min;
      const end = options.reverse ? scale.min : scale.max;
      let i, center, value;
      if (fill === 'start') {
        value = start;
      } else if (fill === 'end') {
        value = end;
      } else if (isObject(fill)) {
        value = fill.value;
      } else {
        value = scale.getBaseValue();
      }
      if (options.grid.circular) {
        center = scale.getPointPositionForValue(0, start);
        return new simpleArc({
          x: center.x,
          y: center.y,
          radius: scale.getDistanceFromCenterForValue(value)
        });
      }
      for (i = 0; i < length; ++i) {
        target.push(scale.getPointPositionForValue(i, value));
      }
      return target;
    }
    function computeBoundary(source) {
      const scale = source.scale || {};
      if (scale.getPointPositionForValue) {
        return computeCircularBoundary(source);
      }
      return computeLinearBoundary(source);
    }
    function findSegmentEnd(start, end, points) {
      for (;end > start; end--) {
        const point = points[end];
        if (!isNaN(point.x) && !isNaN(point.y)) {
          break;
        }
      }
      return end;
    }
    function pointsFromSegments(boundary, line) {
      const {x = null, y = null} = boundary || {};
      const linePoints = line.points;
      const points = [];
      line.segments.forEach(({start, end}) => {
        end = findSegmentEnd(start, end, linePoints);
        const first = linePoints[start];
        const last = linePoints[end];
        if (y !== null) {
          points.push({x: first.x, y});
          points.push({x: last.x, y});
        } else if (x !== null) {
          points.push({x, y: first.y});
          points.push({x, y: last.y});
        }
      });
      return points;
    }
    function buildStackLine(source) {
      const {scale, index, line} = source;
      const points = [];
      const segments = line.segments;
      const sourcePoints = line.points;
      const linesBelow = getLinesBelow(scale, index);
      linesBelow.push(createBoundaryLine({x: null, y: scale.bottom}, line));
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        for (let j = segment.start; j <= segment.end; j++) {
          addPointsBelow(points, sourcePoints[j], linesBelow);
        }
      }
      return new LineElement({points, options: {}});
    }
    function getLinesBelow(scale, index) {
      const below = [];
      const metas = scale.getMatchingVisibleMetas('line');
      for (let i = 0; i < metas.length; i++) {
        const meta = metas[i];
        if (meta.index === index) {
          break;
        }
        if (!meta.hidden) {
          below.unshift(meta.dataset);
        }
      }
      return below;
    }
    function addPointsBelow(points, sourcePoint, linesBelow) {
      const postponed = [];
      for (let j = 0; j < linesBelow.length; j++) {
        const line = linesBelow[j];
        const {first, last, point} = findPoint(line, sourcePoint, 'x');
        if (!point || (first && last)) {
          continue;
        }
        if (first) {
          postponed.unshift(point);
        } else {
          points.push(point);
          if (!last) {
            break;
          }
        }
      }
      points.push(...postponed);
    }
    function findPoint(line, sourcePoint, property) {
      const point = line.interpolate(sourcePoint, property);
      if (!point) {
        return {};
      }
      const pointValue = point[property];
      const segments = line.segments;
      const linePoints = line.points;
      let first = false;
      let last = false;
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const firstValue = linePoints[segment.start][property];
        const lastValue = linePoints[segment.end][property];
        if (_isBetween(pointValue, firstValue, lastValue)) {
          first = pointValue === firstValue;
          last = pointValue === lastValue;
          break;
        }
      }
      return {first, last, point};
    }
    function getTarget(source) {
      const {chart, fill, line} = source;
      if (isNumberFinite(fill)) {
        return getLineByIndex(chart, fill);
      }
      if (fill === 'stack') {
        return buildStackLine(source);
      }
      if (fill === 'shape') {
        return true;
      }
      const boundary = computeBoundary(source);
      if (boundary instanceof simpleArc) {
        return boundary;
      }
      return createBoundaryLine(boundary, line);
    }
    function createBoundaryLine(boundary, line) {
      let points = [];
      let _loop = false;
      if (isArray(boundary)) {
        _loop = true;
        points = boundary;
      } else {
        points = pointsFromSegments(boundary, line);
      }
      return points.length ? new LineElement({
        points,
        options: {tension: 0},
        _loop,
        _fullLoop: _loop
      }) : null;
    }
    function resolveTarget(sources, index, propagate) {
      const source = sources[index];
      let fill = source.fill;
      const visited = [index];
      let target;
      if (!propagate) {
        return fill;
      }
      while (fill !== false && visited.indexOf(fill) === -1) {
        if (!isNumberFinite(fill)) {
          return fill;
        }
        target = sources[fill];
        if (!target) {
          return false;
        }
        if (target.visible) {
          return fill;
        }
        visited.push(fill);
        fill = target.fill;
      }
      return false;
    }
    function _clip(ctx, target, clipY) {
      const {segments, points} = target;
      let first = true;
      let lineLoop = false;
      ctx.beginPath();
      for (const segment of segments) {
        const {start, end} = segment;
        const firstPoint = points[start];
        const lastPoint = points[findSegmentEnd(start, end, points)];
        if (first) {
          ctx.moveTo(firstPoint.x, firstPoint.y);
          first = false;
        } else {
          ctx.lineTo(firstPoint.x, clipY);
          ctx.lineTo(firstPoint.x, firstPoint.y);
        }
        lineLoop = !!target.pathSegment(ctx, segment, {move: lineLoop});
        if (lineLoop) {
          ctx.closePath();
        } else {
          ctx.lineTo(lastPoint.x, clipY);
        }
      }
      ctx.lineTo(target.first().x, clipY);
      ctx.closePath();
      ctx.clip();
    }
    function getBounds(property, first, last, loop) {
      if (loop) {
        return;
      }
      let start = first[property];
      let end = last[property];
      if (property === 'angle') {
        start = _normalizeAngle(start);
        end = _normalizeAngle(end);
      }
      return {property, start, end};
    }
    function _getEdge(a, b, prop, fn) {
      if (a && b) {
        return fn(a[prop], b[prop]);
      }
      return a ? a[prop] : b ? b[prop] : 0;
    }
    function _segments(line, target, property) {
      const segments = line.segments;
      const points = line.points;
      const tpoints = target.points;
      const parts = [];
      for (const segment of segments) {
        let {start, end} = segment;
        end = findSegmentEnd(start, end, points);
        const bounds = getBounds(property, points[start], points[end], segment.loop);
        if (!target.segments) {
          parts.push({
            source: segment,
            target: bounds,
            start: points[start],
            end: points[end]
          });
          continue;
        }
        const targetSegments = _boundSegments(target, bounds);
        for (const tgt of targetSegments) {
          const subBounds = getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
          const fillSources = _boundSegment(segment, points, subBounds);
          for (const fillSource of fillSources) {
            parts.push({
              source: fillSource,
              target: tgt,
              start: {
                [property]: _getEdge(bounds, subBounds, 'start', Math.max)
              },
              end: {
                [property]: _getEdge(bounds, subBounds, 'end', Math.min)
              }
            });
          }
        }
      }
      return parts;
    }
    function clipBounds(ctx, scale, bounds) {
      const {top, bottom} = scale.chart.chartArea;
      const {property, start, end} = bounds || {};
      if (property === 'x') {
        ctx.beginPath();
        ctx.rect(start, top, end - start, bottom - top);
        ctx.clip();
      }
    }
    function interpolatedLineTo(ctx, target, point, property) {
      const interpolatedPoint = target.interpolate(point, property);
      if (interpolatedPoint) {
        ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
      }
    }
    function _fill(ctx, cfg) {
      const {line, target, property, color, scale} = cfg;
      const segments = _segments(line, target, property);
      for (const {source: src, target: tgt, start, end} of segments) {
        const {style: {backgroundColor = color} = {}} = src;
        const notShape = target !== true;
        ctx.save();
        ctx.fillStyle = backgroundColor;
        clipBounds(ctx, scale, notShape && getBounds(property, start, end));
        ctx.beginPath();
        const lineLoop = !!line.pathSegment(ctx, src);
        let loop;
        if (notShape) {
          if (lineLoop) {
            ctx.closePath();
          } else {
            interpolatedLineTo(ctx, target, end, property);
          }
          const targetLoop = !!target.pathSegment(ctx, tgt, {move: lineLoop, reverse: true});
          loop = lineLoop && targetLoop;
          if (!loop) {
            interpolatedLineTo(ctx, target, start, property);
          }
        }
        ctx.closePath();
        ctx.fill(loop ? 'evenodd' : 'nonzero');
        ctx.restore();
      }
    }
    function doFill(ctx, cfg) {
      const {line, target, above, below, area, scale} = cfg;
      const property = line._loop ? 'angle' : cfg.axis;
      ctx.save();
      if (property === 'x' && below !== above) {
        _clip(ctx, target, area.top);
        _fill(ctx, {line, target, color: above, scale, property});
        ctx.restore();
        ctx.save();
        _clip(ctx, target, area.bottom);
      }
      _fill(ctx, {line, target, color: below, scale, property});
      ctx.restore();
    }
    function drawfill(ctx, source, area) {
      const target = getTarget(source);
      const {line, scale, axis} = source;
      const lineOpts = line.options;
      const fillOption = lineOpts.fill;
      const color = lineOpts.backgroundColor;
      const {above = color, below = color} = fillOption || {};
      if (target && line.points.length) {
        clipArea(ctx, area);
        doFill(ctx, {line, target, above, below, area, scale, axis});
        unclipArea(ctx);
      }
    }
    var plugin_filler = {
      id: 'filler',
      afterDatasetsUpdate(chart, _args, options) {
        const count = (chart.data.datasets || []).length;
        const sources = [];
        let meta, i, line, source;
        for (i = 0; i < count; ++i) {
          meta = chart.getDatasetMeta(i);
          line = meta.dataset;
          source = null;
          if (line && line.options && line instanceof LineElement) {
            source = {
              visible: chart.isDatasetVisible(i),
              index: i,
              fill: decodeFill(line, i, count),
              chart,
              axis: meta.controller.options.indexAxis,
              scale: meta.vScale,
              line,
            };
          }
          meta.$filler = source;
          sources.push(source);
        }
        for (i = 0; i < count; ++i) {
          source = sources[i];
          if (!source || source.fill === false) {
            continue;
          }
          source.fill = resolveTarget(sources, i, options.propagate);
        }
      },
      beforeDraw(chart, _args, options) {
        const draw = options.drawTime === 'beforeDraw';
        const metasets = chart.getSortedVisibleDatasetMetas();
        const area = chart.chartArea;
        for (let i = metasets.length - 1; i >= 0; --i) {
          const source = metasets[i].$filler;
          if (!source) {
            continue;
          }
          source.line.updateControlPoints(area, source.axis);
          if (draw) {
            drawfill(chart.ctx, source, area);
          }
        }
      },
      beforeDatasetsDraw(chart, _args, options) {
        if (options.drawTime !== 'beforeDatasetsDraw') {
          return;
        }
        const metasets = chart.getSortedVisibleDatasetMetas();
        for (let i = metasets.length - 1; i >= 0; --i) {
          const source = metasets[i].$filler;
          if (source) {
            drawfill(chart.ctx, source, chart.chartArea);
          }
        }
      },
      beforeDatasetDraw(chart, args, options) {
        const source = args.meta.$filler;
        if (!source || source.fill === false || options.drawTime !== 'beforeDatasetDraw') {
          return;
        }
        drawfill(chart.ctx, source, chart.chartArea);
      },
      defaults: {
        propagate: true,
        drawTime: 'beforeDatasetDraw'
      }
    };

    const getBoxSize = (labelOpts, fontSize) => {
      let {boxHeight = fontSize, boxWidth = fontSize} = labelOpts;
      if (labelOpts.usePointStyle) {
        boxHeight = Math.min(boxHeight, fontSize);
        boxWidth = Math.min(boxWidth, fontSize);
      }
      return {
        boxWidth,
        boxHeight,
        itemHeight: Math.max(fontSize, boxHeight)
      };
    };
    const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;
    class Legend extends Element {
      constructor(config) {
        super();
        this._added = false;
        this.legendHitBoxes = [];
        this._hoveredItem = null;
        this.doughnutMode = false;
        this.chart = config.chart;
        this.options = config.options;
        this.ctx = config.ctx;
        this.legendItems = undefined;
        this.columnSizes = undefined;
        this.lineWidths = undefined;
        this.maxHeight = undefined;
        this.maxWidth = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.height = undefined;
        this.width = undefined;
        this._margins = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
      }
      update(maxWidth, maxHeight, margins) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this._margins = margins;
        this.setDimensions();
        this.buildLabels();
        this.fit();
      }
      setDimensions() {
        if (this.isHorizontal()) {
          this.width = this.maxWidth;
          this.left = this._margins.left;
          this.right = this.width;
        } else {
          this.height = this.maxHeight;
          this.top = this._margins.top;
          this.bottom = this.height;
        }
      }
      buildLabels() {
        const labelOpts = this.options.labels || {};
        let legendItems = callback(labelOpts.generateLabels, [this.chart], this) || [];
        if (labelOpts.filter) {
          legendItems = legendItems.filter((item) => labelOpts.filter(item, this.chart.data));
        }
        if (labelOpts.sort) {
          legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, this.chart.data));
        }
        if (this.options.reverse) {
          legendItems.reverse();
        }
        this.legendItems = legendItems;
      }
      fit() {
        const {options, ctx} = this;
        if (!options.display) {
          this.width = this.height = 0;
          return;
        }
        const labelOpts = options.labels;
        const labelFont = toFont(labelOpts.font);
        const fontSize = labelFont.size;
        const titleHeight = this._computeTitleHeight();
        const {boxWidth, itemHeight} = getBoxSize(labelOpts, fontSize);
        let width, height;
        ctx.font = labelFont.string;
        if (this.isHorizontal()) {
          width = this.maxWidth;
          height = this._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
        } else {
          height = this.maxHeight;
          width = this._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10;
        }
        this.width = Math.min(width, options.maxWidth || this.maxWidth);
        this.height = Math.min(height, options.maxHeight || this.maxHeight);
      }
      _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
        const {ctx, maxWidth, options: {labels: {padding}}} = this;
        const hitboxes = this.legendHitBoxes = [];
        const lineWidths = this.lineWidths = [0];
        const lineHeight = itemHeight + padding;
        let totalHeight = titleHeight;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        let row = -1;
        let top = -lineHeight;
        this.legendItems.forEach((legendItem, i) => {
          const itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
          if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
            totalHeight += lineHeight;
            lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
            top += lineHeight;
            row++;
          }
          hitboxes[i] = {left: 0, top, row, width: itemWidth, height: itemHeight};
          lineWidths[lineWidths.length - 1] += itemWidth + padding;
        });
        return totalHeight;
      }
      _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
        const {ctx, maxHeight, options: {labels: {padding}}} = this;
        const hitboxes = this.legendHitBoxes = [];
        const columnSizes = this.columnSizes = [];
        const heightLimit = maxHeight - titleHeight;
        let totalWidth = padding;
        let currentColWidth = 0;
        let currentColHeight = 0;
        let left = 0;
        let col = 0;
        this.legendItems.forEach((legendItem, i) => {
          const itemWidth = boxWidth + (fontSize / 2) + ctx.measureText(legendItem.text).width;
          if (i > 0 && currentColHeight + itemHeight + 2 * padding > heightLimit) {
            totalWidth += currentColWidth + padding;
            columnSizes.push({width: currentColWidth, height: currentColHeight});
            left += currentColWidth + padding;
            col++;
            currentColWidth = currentColHeight = 0;
          }
          hitboxes[i] = {left, top: currentColHeight, col, width: itemWidth, height: itemHeight};
          currentColWidth = Math.max(currentColWidth, itemWidth);
          currentColHeight += itemHeight + padding;
        });
        totalWidth += currentColWidth;
        columnSizes.push({width: currentColWidth, height: currentColHeight});
        return totalWidth;
      }
      adjustHitBoxes() {
        if (!this.options.display) {
          return;
        }
        const titleHeight = this._computeTitleHeight();
        const {legendHitBoxes: hitboxes, options: {align, labels: {padding}, rtl}} = this;
        const rtlHelper = getRtlAdapter(rtl, this.left, this.width);
        if (this.isHorizontal()) {
          let row = 0;
          let left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
          for (const hitbox of hitboxes) {
            if (row !== hitbox.row) {
              row = hitbox.row;
              left = _alignStartEnd(align, this.left + padding, this.right - this.lineWidths[row]);
            }
            hitbox.top += this.top + titleHeight + padding;
            hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(left), hitbox.width);
            left += hitbox.width + padding;
          }
        } else {
          let col = 0;
          let top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
          for (const hitbox of hitboxes) {
            if (hitbox.col !== col) {
              col = hitbox.col;
              top = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - this.columnSizes[col].height);
            }
            hitbox.top = top;
            hitbox.left += this.left + padding;
            hitbox.left = rtlHelper.leftForLtr(rtlHelper.x(hitbox.left), hitbox.width);
            top += hitbox.height + padding;
          }
        }
      }
      isHorizontal() {
        return this.options.position === 'top' || this.options.position === 'bottom';
      }
      draw() {
        if (this.options.display) {
          const ctx = this.ctx;
          clipArea(ctx, this);
          this._draw();
          unclipArea(ctx);
        }
      }
      _draw() {
        const {options: opts, columnSizes, lineWidths, ctx} = this;
        const {align, labels: labelOpts} = opts;
        const defaultColor = defaults.color;
        const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        const labelFont = toFont(labelOpts.font);
        const {color: fontColor, padding} = labelOpts;
        const fontSize = labelFont.size;
        const halfFontSize = fontSize / 2;
        let cursor;
        this.drawTitle();
        ctx.textAlign = rtlHelper.textAlign('left');
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 0.5;
        ctx.font = labelFont.string;
        const {boxWidth, boxHeight, itemHeight} = getBoxSize(labelOpts, fontSize);
        const drawLegendBox = function(x, y, legendItem) {
          if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
            return;
          }
          ctx.save();
          const lineWidth = valueOrDefault(legendItem.lineWidth, 1);
          ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
          ctx.lineCap = valueOrDefault(legendItem.lineCap, 'butt');
          ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, 0);
          ctx.lineJoin = valueOrDefault(legendItem.lineJoin, 'miter');
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
          ctx.setLineDash(valueOrDefault(legendItem.lineDash, []));
          if (labelOpts.usePointStyle) {
            const drawOptions = {
              radius: boxWidth * Math.SQRT2 / 2,
              pointStyle: legendItem.pointStyle,
              rotation: legendItem.rotation,
              borderWidth: lineWidth
            };
            const centerX = rtlHelper.xPlus(x, boxWidth / 2);
            const centerY = y + halfFontSize;
            drawPoint(ctx, drawOptions, centerX, centerY);
          } else {
            const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
            const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
            const borderRadius = toTRBLCorners(legendItem.borderRadius);
            ctx.beginPath();
            if (Object.values(borderRadius).some(v => v !== 0)) {
              addRoundedRectPath(ctx, {
                x: xBoxLeft,
                y: yBoxTop,
                w: boxWidth,
                h: boxHeight,
                radius: borderRadius,
              });
            } else {
              ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
            }
            ctx.fill();
            if (lineWidth !== 0) {
              ctx.stroke();
            }
          }
          ctx.restore();
        };
        const fillText = function(x, y, legendItem) {
          renderText(ctx, legendItem.text, x, y + (itemHeight / 2), labelFont, {
            strikethrough: legendItem.hidden,
            textAlign: rtlHelper.textAlign(legendItem.textAlign)
          });
        };
        const isHorizontal = this.isHorizontal();
        const titleHeight = this._computeTitleHeight();
        if (isHorizontal) {
          cursor = {
            x: _alignStartEnd(align, this.left + padding, this.right - lineWidths[0]),
            y: this.top + padding + titleHeight,
            line: 0
          };
        } else {
          cursor = {
            x: this.left + padding,
            y: _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[0].height),
            line: 0
          };
        }
        overrideTextDirection(this.ctx, opts.textDirection);
        const lineHeight = itemHeight + padding;
        this.legendItems.forEach((legendItem, i) => {
          ctx.strokeStyle = legendItem.fontColor || fontColor;
          ctx.fillStyle = legendItem.fontColor || fontColor;
          const textWidth = ctx.measureText(legendItem.text).width;
          const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
          const width = boxWidth + halfFontSize + textWidth;
          let x = cursor.x;
          let y = cursor.y;
          rtlHelper.setWidth(this.width);
          if (isHorizontal) {
            if (i > 0 && x + width + padding > this.right) {
              y = cursor.y += lineHeight;
              cursor.line++;
              x = cursor.x = _alignStartEnd(align, this.left + padding, this.right - lineWidths[cursor.line]);
            }
          } else if (i > 0 && y + lineHeight > this.bottom) {
            x = cursor.x = x + columnSizes[cursor.line].width + padding;
            cursor.line++;
            y = cursor.y = _alignStartEnd(align, this.top + titleHeight + padding, this.bottom - columnSizes[cursor.line].height);
          }
          const realX = rtlHelper.x(x);
          drawLegendBox(realX, y, legendItem);
          x = _textX(textAlign, x + boxWidth + halfFontSize, isHorizontal ? x + width : this.right, opts.rtl);
          fillText(rtlHelper.x(x), y, legendItem);
          if (isHorizontal) {
            cursor.x += width + padding;
          } else {
            cursor.y += lineHeight;
          }
        });
        restoreTextDirection(this.ctx, opts.textDirection);
      }
      drawTitle() {
        const opts = this.options;
        const titleOpts = opts.title;
        const titleFont = toFont(titleOpts.font);
        const titlePadding = toPadding(titleOpts.padding);
        if (!titleOpts.display) {
          return;
        }
        const rtlHelper = getRtlAdapter(opts.rtl, this.left, this.width);
        const ctx = this.ctx;
        const position = titleOpts.position;
        const halfFontSize = titleFont.size / 2;
        const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
        let y;
        let left = this.left;
        let maxWidth = this.width;
        if (this.isHorizontal()) {
          maxWidth = Math.max(...this.lineWidths);
          y = this.top + topPaddingPlusHalfFontSize;
          left = _alignStartEnd(opts.align, left, this.right - maxWidth);
        } else {
          const maxHeight = this.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
          y = topPaddingPlusHalfFontSize + _alignStartEnd(opts.align, this.top, this.bottom - maxHeight - opts.labels.padding - this._computeTitleHeight());
        }
        const x = _alignStartEnd(position, left, left + maxWidth);
        ctx.textAlign = rtlHelper.textAlign(_toLeftRightCenter(position));
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = titleOpts.color;
        ctx.fillStyle = titleOpts.color;
        ctx.font = titleFont.string;
        renderText(ctx, titleOpts.text, x, y, titleFont);
      }
      _computeTitleHeight() {
        const titleOpts = this.options.title;
        const titleFont = toFont(titleOpts.font);
        const titlePadding = toPadding(titleOpts.padding);
        return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
      }
      _getLegendItemAt(x, y) {
        let i, hitBox, lh;
        if (_isBetween(x, this.left, this.right)
          && _isBetween(y, this.top, this.bottom)) {
          lh = this.legendHitBoxes;
          for (i = 0; i < lh.length; ++i) {
            hitBox = lh[i];
            if (_isBetween(x, hitBox.left, hitBox.left + hitBox.width)
              && _isBetween(y, hitBox.top, hitBox.top + hitBox.height)) {
              return this.legendItems[i];
            }
          }
        }
        return null;
      }
      handleEvent(e) {
        const opts = this.options;
        if (!isListened(e.type, opts)) {
          return;
        }
        const hoveredItem = this._getLegendItemAt(e.x, e.y);
        if (e.type === 'mousemove') {
          const previous = this._hoveredItem;
          const sameItem = itemsEqual(previous, hoveredItem);
          if (previous && !sameItem) {
            callback(opts.onLeave, [e, previous, this], this);
          }
          this._hoveredItem = hoveredItem;
          if (hoveredItem && !sameItem) {
            callback(opts.onHover, [e, hoveredItem, this], this);
          }
        } else if (hoveredItem) {
          callback(opts.onClick, [e, hoveredItem, this], this);
        }
      }
    }
    function isListened(type, opts) {
      if (type === 'mousemove' && (opts.onHover || opts.onLeave)) {
        return true;
      }
      if (opts.onClick && (type === 'click' || type === 'mouseup')) {
        return true;
      }
      return false;
    }
    var plugin_legend = {
      id: 'legend',
      _element: Legend,
      start(chart, _args, options) {
        const legend = chart.legend = new Legend({ctx: chart.ctx, options, chart});
        layouts.configure(chart, legend, options);
        layouts.addBox(chart, legend);
      },
      stop(chart) {
        layouts.removeBox(chart, chart.legend);
        delete chart.legend;
      },
      beforeUpdate(chart, _args, options) {
        const legend = chart.legend;
        layouts.configure(chart, legend, options);
        legend.options = options;
      },
      afterUpdate(chart) {
        const legend = chart.legend;
        legend.buildLabels();
        legend.adjustHitBoxes();
      },
      afterEvent(chart, args) {
        if (!args.replay) {
          chart.legend.handleEvent(args.event);
        }
      },
      defaults: {
        display: true,
        position: 'top',
        align: 'center',
        fullSize: true,
        reverse: false,
        weight: 1000,
        onClick(e, legendItem, legend) {
          const index = legendItem.datasetIndex;
          const ci = legend.chart;
          if (ci.isDatasetVisible(index)) {
            ci.hide(index);
            legendItem.hidden = true;
          } else {
            ci.show(index);
            legendItem.hidden = false;
          }
        },
        onHover: null,
        onLeave: null,
        labels: {
          color: (ctx) => ctx.chart.options.color,
          boxWidth: 40,
          padding: 10,
          generateLabels(chart) {
            const datasets = chart.data.datasets;
            const {labels: {usePointStyle, pointStyle, textAlign, color}} = chart.legend.options;
            return chart._getSortedDatasetMetas().map((meta) => {
              const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
              const borderWidth = toPadding(style.borderWidth);
              return {
                text: datasets[meta.index].label,
                fillStyle: style.backgroundColor,
                fontColor: color,
                hidden: !meta.visible,
                lineCap: style.borderCapStyle,
                lineDash: style.borderDash,
                lineDashOffset: style.borderDashOffset,
                lineJoin: style.borderJoinStyle,
                lineWidth: (borderWidth.width + borderWidth.height) / 4,
                strokeStyle: style.borderColor,
                pointStyle: pointStyle || style.pointStyle,
                rotation: style.rotation,
                textAlign: textAlign || style.textAlign,
                borderRadius: 0,
                datasetIndex: meta.index
              };
            }, this);
          }
        },
        title: {
          color: (ctx) => ctx.chart.options.color,
          display: false,
          position: 'center',
          text: '',
        }
      },
      descriptors: {
        _scriptable: (name) => !name.startsWith('on'),
        labels: {
          _scriptable: (name) => !['generateLabels', 'filter', 'sort'].includes(name),
        }
      },
    };

    class Title extends Element {
      constructor(config) {
        super();
        this.chart = config.chart;
        this.options = config.options;
        this.ctx = config.ctx;
        this._padding = undefined;
        this.top = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.right = undefined;
        this.width = undefined;
        this.height = undefined;
        this.position = undefined;
        this.weight = undefined;
        this.fullSize = undefined;
      }
      update(maxWidth, maxHeight) {
        const opts = this.options;
        this.left = 0;
        this.top = 0;
        if (!opts.display) {
          this.width = this.height = this.right = this.bottom = 0;
          return;
        }
        this.width = this.right = maxWidth;
        this.height = this.bottom = maxHeight;
        const lineCount = isArray(opts.text) ? opts.text.length : 1;
        this._padding = toPadding(opts.padding);
        const textSize = lineCount * toFont(opts.font).lineHeight + this._padding.height;
        if (this.isHorizontal()) {
          this.height = textSize;
        } else {
          this.width = textSize;
        }
      }
      isHorizontal() {
        const pos = this.options.position;
        return pos === 'top' || pos === 'bottom';
      }
      _drawArgs(offset) {
        const {top, left, bottom, right, options} = this;
        const align = options.align;
        let rotation = 0;
        let maxWidth, titleX, titleY;
        if (this.isHorizontal()) {
          titleX = _alignStartEnd(align, left, right);
          titleY = top + offset;
          maxWidth = right - left;
        } else {
          if (options.position === 'left') {
            titleX = left + offset;
            titleY = _alignStartEnd(align, bottom, top);
            rotation = PI * -0.5;
          } else {
            titleX = right - offset;
            titleY = _alignStartEnd(align, top, bottom);
            rotation = PI * 0.5;
          }
          maxWidth = bottom - top;
        }
        return {titleX, titleY, maxWidth, rotation};
      }
      draw() {
        const ctx = this.ctx;
        const opts = this.options;
        if (!opts.display) {
          return;
        }
        const fontOpts = toFont(opts.font);
        const lineHeight = fontOpts.lineHeight;
        const offset = lineHeight / 2 + this._padding.top;
        const {titleX, titleY, maxWidth, rotation} = this._drawArgs(offset);
        renderText(ctx, opts.text, 0, 0, fontOpts, {
          color: opts.color,
          maxWidth,
          rotation,
          textAlign: _toLeftRightCenter(opts.align),
          textBaseline: 'middle',
          translation: [titleX, titleY],
        });
      }
    }
    function createTitle(chart, titleOpts) {
      const title = new Title({
        ctx: chart.ctx,
        options: titleOpts,
        chart
      });
      layouts.configure(chart, title, titleOpts);
      layouts.addBox(chart, title);
      chart.titleBlock = title;
    }
    var plugin_title = {
      id: 'title',
      _element: Title,
      start(chart, _args, options) {
        createTitle(chart, options);
      },
      stop(chart) {
        const titleBlock = chart.titleBlock;
        layouts.removeBox(chart, titleBlock);
        delete chart.titleBlock;
      },
      beforeUpdate(chart, _args, options) {
        const title = chart.titleBlock;
        layouts.configure(chart, title, options);
        title.options = options;
      },
      defaults: {
        align: 'center',
        display: false,
        font: {
          weight: 'bold',
        },
        fullSize: true,
        padding: 10,
        position: 'top',
        text: '',
        weight: 2000
      },
      defaultRoutes: {
        color: 'color'
      },
      descriptors: {
        _scriptable: true,
        _indexable: false,
      },
    };

    const map = new WeakMap();
    var plugin_subtitle = {
      id: 'subtitle',
      start(chart, _args, options) {
        const title = new Title({
          ctx: chart.ctx,
          options,
          chart
        });
        layouts.configure(chart, title, options);
        layouts.addBox(chart, title);
        map.set(chart, title);
      },
      stop(chart) {
        layouts.removeBox(chart, map.get(chart));
        map.delete(chart);
      },
      beforeUpdate(chart, _args, options) {
        const title = map.get(chart);
        layouts.configure(chart, title, options);
        title.options = options;
      },
      defaults: {
        align: 'center',
        display: false,
        font: {
          weight: 'normal',
        },
        fullSize: true,
        padding: 0,
        position: 'top',
        text: '',
        weight: 1500
      },
      defaultRoutes: {
        color: 'color'
      },
      descriptors: {
        _scriptable: true,
        _indexable: false,
      },
    };

    const positioners = {
      average(items) {
        if (!items.length) {
          return false;
        }
        let i, len;
        let x = 0;
        let y = 0;
        let count = 0;
        for (i = 0, len = items.length; i < len; ++i) {
          const el = items[i].element;
          if (el && el.hasValue()) {
            const pos = el.tooltipPosition();
            x += pos.x;
            y += pos.y;
            ++count;
          }
        }
        return {
          x: x / count,
          y: y / count
        };
      },
      nearest(items, eventPosition) {
        if (!items.length) {
          return false;
        }
        let x = eventPosition.x;
        let y = eventPosition.y;
        let minDistance = Number.POSITIVE_INFINITY;
        let i, len, nearestElement;
        for (i = 0, len = items.length; i < len; ++i) {
          const el = items[i].element;
          if (el && el.hasValue()) {
            const center = el.getCenterPoint();
            const d = distanceBetweenPoints(eventPosition, center);
            if (d < minDistance) {
              minDistance = d;
              nearestElement = el;
            }
          }
        }
        if (nearestElement) {
          const tp = nearestElement.tooltipPosition();
          x = tp.x;
          y = tp.y;
        }
        return {
          x,
          y
        };
      }
    };
    function pushOrConcat(base, toPush) {
      if (toPush) {
        if (isArray(toPush)) {
          Array.prototype.push.apply(base, toPush);
        } else {
          base.push(toPush);
        }
      }
      return base;
    }
    function splitNewlines(str) {
      if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
        return str.split('\n');
      }
      return str;
    }
    function createTooltipItem(chart, item) {
      const {element, datasetIndex, index} = item;
      const controller = chart.getDatasetMeta(datasetIndex).controller;
      const {label, value} = controller.getLabelAndValue(index);
      return {
        chart,
        label,
        parsed: controller.getParsed(index),
        raw: chart.data.datasets[datasetIndex].data[index],
        formattedValue: value,
        dataset: controller.getDataset(),
        dataIndex: index,
        datasetIndex,
        element
      };
    }
    function getTooltipSize(tooltip, options) {
      const ctx = tooltip.chart.ctx;
      const {body, footer, title} = tooltip;
      const {boxWidth, boxHeight} = options;
      const bodyFont = toFont(options.bodyFont);
      const titleFont = toFont(options.titleFont);
      const footerFont = toFont(options.footerFont);
      const titleLineCount = title.length;
      const footerLineCount = footer.length;
      const bodyLineItemCount = body.length;
      const padding = toPadding(options.padding);
      let height = padding.height;
      let width = 0;
      let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
      combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;
      if (titleLineCount) {
        height += titleLineCount * titleFont.lineHeight
    			+ (titleLineCount - 1) * options.titleSpacing
    			+ options.titleMarginBottom;
      }
      if (combinedBodyLength) {
        const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
        height += bodyLineItemCount * bodyLineHeight
    			+ (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight
    			+ (combinedBodyLength - 1) * options.bodySpacing;
      }
      if (footerLineCount) {
        height += options.footerMarginTop
    			+ footerLineCount * footerFont.lineHeight
    			+ (footerLineCount - 1) * options.footerSpacing;
      }
      let widthPadding = 0;
      const maxLineWidth = function(line) {
        width = Math.max(width, ctx.measureText(line).width + widthPadding);
      };
      ctx.save();
      ctx.font = titleFont.string;
      each(tooltip.title, maxLineWidth);
      ctx.font = bodyFont.string;
      each(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
      widthPadding = options.displayColors ? (boxWidth + 2 + options.boxPadding) : 0;
      each(body, (bodyItem) => {
        each(bodyItem.before, maxLineWidth);
        each(bodyItem.lines, maxLineWidth);
        each(bodyItem.after, maxLineWidth);
      });
      widthPadding = 0;
      ctx.font = footerFont.string;
      each(tooltip.footer, maxLineWidth);
      ctx.restore();
      width += padding.width;
      return {width, height};
    }
    function determineYAlign(chart, size) {
      const {y, height} = size;
      if (y < height / 2) {
        return 'top';
      } else if (y > (chart.height - height / 2)) {
        return 'bottom';
      }
      return 'center';
    }
    function doesNotFitWithAlign(xAlign, chart, options, size) {
      const {x, width} = size;
      const caret = options.caretSize + options.caretPadding;
      if (xAlign === 'left' && x + width + caret > chart.width) {
        return true;
      }
      if (xAlign === 'right' && x - width - caret < 0) {
        return true;
      }
    }
    function determineXAlign(chart, options, size, yAlign) {
      const {x, width} = size;
      const {width: chartWidth, chartArea: {left, right}} = chart;
      let xAlign = 'center';
      if (yAlign === 'center') {
        xAlign = x <= (left + right) / 2 ? 'left' : 'right';
      } else if (x <= width / 2) {
        xAlign = 'left';
      } else if (x >= chartWidth - width / 2) {
        xAlign = 'right';
      }
      if (doesNotFitWithAlign(xAlign, chart, options, size)) {
        xAlign = 'center';
      }
      return xAlign;
    }
    function determineAlignment(chart, options, size) {
      const yAlign = size.yAlign || options.yAlign || determineYAlign(chart, size);
      return {
        xAlign: size.xAlign || options.xAlign || determineXAlign(chart, options, size, yAlign),
        yAlign
      };
    }
    function alignX(size, xAlign) {
      let {x, width} = size;
      if (xAlign === 'right') {
        x -= width;
      } else if (xAlign === 'center') {
        x -= (width / 2);
      }
      return x;
    }
    function alignY(size, yAlign, paddingAndSize) {
      let {y, height} = size;
      if (yAlign === 'top') {
        y += paddingAndSize;
      } else if (yAlign === 'bottom') {
        y -= height + paddingAndSize;
      } else {
        y -= (height / 2);
      }
      return y;
    }
    function getBackgroundPoint(options, size, alignment, chart) {
      const {caretSize, caretPadding, cornerRadius} = options;
      const {xAlign, yAlign} = alignment;
      const paddingAndSize = caretSize + caretPadding;
      const {topLeft, topRight, bottomLeft, bottomRight} = toTRBLCorners(cornerRadius);
      let x = alignX(size, xAlign);
      const y = alignY(size, yAlign, paddingAndSize);
      if (yAlign === 'center') {
        if (xAlign === 'left') {
          x += paddingAndSize;
        } else if (xAlign === 'right') {
          x -= paddingAndSize;
        }
      } else if (xAlign === 'left') {
        x -= Math.max(topLeft, bottomLeft) + caretSize;
      } else if (xAlign === 'right') {
        x += Math.max(topRight, bottomRight) + caretSize;
      }
      return {
        x: _limitValue(x, 0, chart.width - size.width),
        y: _limitValue(y, 0, chart.height - size.height)
      };
    }
    function getAlignedX(tooltip, align, options) {
      const padding = toPadding(options.padding);
      return align === 'center'
        ? tooltip.x + tooltip.width / 2
        : align === 'right'
          ? tooltip.x + tooltip.width - padding.right
          : tooltip.x + padding.left;
    }
    function getBeforeAfterBodyLines(callback) {
      return pushOrConcat([], splitNewlines(callback));
    }
    function createTooltipContext(parent, tooltip, tooltipItems) {
      return createContext(parent, {
        tooltip,
        tooltipItems,
        type: 'tooltip'
      });
    }
    function overrideCallbacks(callbacks, context) {
      const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
      return override ? callbacks.override(override) : callbacks;
    }
    class Tooltip extends Element {
      constructor(config) {
        super();
        this.opacity = 0;
        this._active = [];
        this._eventPosition = undefined;
        this._size = undefined;
        this._cachedAnimations = undefined;
        this._tooltipItems = [];
        this.$animations = undefined;
        this.$context = undefined;
        this.chart = config.chart || config._chart;
        this._chart = this.chart;
        this.options = config.options;
        this.dataPoints = undefined;
        this.title = undefined;
        this.beforeBody = undefined;
        this.body = undefined;
        this.afterBody = undefined;
        this.footer = undefined;
        this.xAlign = undefined;
        this.yAlign = undefined;
        this.x = undefined;
        this.y = undefined;
        this.height = undefined;
        this.width = undefined;
        this.caretX = undefined;
        this.caretY = undefined;
        this.labelColors = undefined;
        this.labelPointStyles = undefined;
        this.labelTextColors = undefined;
      }
      initialize(options) {
        this.options = options;
        this._cachedAnimations = undefined;
        this.$context = undefined;
      }
      _resolveAnimations() {
        const cached = this._cachedAnimations;
        if (cached) {
          return cached;
        }
        const chart = this.chart;
        const options = this.options.setContext(this.getContext());
        const opts = options.enabled && chart.options.animation && options.animations;
        const animations = new Animations(this.chart, opts);
        if (opts._cacheable) {
          this._cachedAnimations = Object.freeze(animations);
        }
        return animations;
      }
      getContext() {
        return this.$context ||
    			(this.$context = createTooltipContext(this.chart.getContext(), this, this._tooltipItems));
      }
      getTitle(context, options) {
        const {callbacks} = options;
        const beforeTitle = callbacks.beforeTitle.apply(this, [context]);
        const title = callbacks.title.apply(this, [context]);
        const afterTitle = callbacks.afterTitle.apply(this, [context]);
        let lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeTitle));
        lines = pushOrConcat(lines, splitNewlines(title));
        lines = pushOrConcat(lines, splitNewlines(afterTitle));
        return lines;
      }
      getBeforeBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(options.callbacks.beforeBody.apply(this, [tooltipItems]));
      }
      getBody(tooltipItems, options) {
        const {callbacks} = options;
        const bodyItems = [];
        each(tooltipItems, (context) => {
          const bodyItem = {
            before: [],
            lines: [],
            after: []
          };
          const scoped = overrideCallbacks(callbacks, context);
          pushOrConcat(bodyItem.before, splitNewlines(scoped.beforeLabel.call(this, context)));
          pushOrConcat(bodyItem.lines, scoped.label.call(this, context));
          pushOrConcat(bodyItem.after, splitNewlines(scoped.afterLabel.call(this, context)));
          bodyItems.push(bodyItem);
        });
        return bodyItems;
      }
      getAfterBody(tooltipItems, options) {
        return getBeforeAfterBodyLines(options.callbacks.afterBody.apply(this, [tooltipItems]));
      }
      getFooter(tooltipItems, options) {
        const {callbacks} = options;
        const beforeFooter = callbacks.beforeFooter.apply(this, [tooltipItems]);
        const footer = callbacks.footer.apply(this, [tooltipItems]);
        const afterFooter = callbacks.afterFooter.apply(this, [tooltipItems]);
        let lines = [];
        lines = pushOrConcat(lines, splitNewlines(beforeFooter));
        lines = pushOrConcat(lines, splitNewlines(footer));
        lines = pushOrConcat(lines, splitNewlines(afterFooter));
        return lines;
      }
      _createItems(options) {
        const active = this._active;
        const data = this.chart.data;
        const labelColors = [];
        const labelPointStyles = [];
        const labelTextColors = [];
        let tooltipItems = [];
        let i, len;
        for (i = 0, len = active.length; i < len; ++i) {
          tooltipItems.push(createTooltipItem(this.chart, active[i]));
        }
        if (options.filter) {
          tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
        }
        if (options.itemSort) {
          tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
        }
        each(tooltipItems, (context) => {
          const scoped = overrideCallbacks(options.callbacks, context);
          labelColors.push(scoped.labelColor.call(this, context));
          labelPointStyles.push(scoped.labelPointStyle.call(this, context));
          labelTextColors.push(scoped.labelTextColor.call(this, context));
        });
        this.labelColors = labelColors;
        this.labelPointStyles = labelPointStyles;
        this.labelTextColors = labelTextColors;
        this.dataPoints = tooltipItems;
        return tooltipItems;
      }
      update(changed, replay) {
        const options = this.options.setContext(this.getContext());
        const active = this._active;
        let properties;
        let tooltipItems = [];
        if (!active.length) {
          if (this.opacity !== 0) {
            properties = {
              opacity: 0
            };
          }
        } else {
          const position = positioners[options.position].call(this, active, this._eventPosition);
          tooltipItems = this._createItems(options);
          this.title = this.getTitle(tooltipItems, options);
          this.beforeBody = this.getBeforeBody(tooltipItems, options);
          this.body = this.getBody(tooltipItems, options);
          this.afterBody = this.getAfterBody(tooltipItems, options);
          this.footer = this.getFooter(tooltipItems, options);
          const size = this._size = getTooltipSize(this, options);
          const positionAndSize = Object.assign({}, position, size);
          const alignment = determineAlignment(this.chart, options, positionAndSize);
          const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, this.chart);
          this.xAlign = alignment.xAlign;
          this.yAlign = alignment.yAlign;
          properties = {
            opacity: 1,
            x: backgroundPoint.x,
            y: backgroundPoint.y,
            width: size.width,
            height: size.height,
            caretX: position.x,
            caretY: position.y
          };
        }
        this._tooltipItems = tooltipItems;
        this.$context = undefined;
        if (properties) {
          this._resolveAnimations().update(this, properties);
        }
        if (changed && options.external) {
          options.external.call(this, {chart: this.chart, tooltip: this, replay});
        }
      }
      drawCaret(tooltipPoint, ctx, size, options) {
        const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
        ctx.lineTo(caretPosition.x1, caretPosition.y1);
        ctx.lineTo(caretPosition.x2, caretPosition.y2);
        ctx.lineTo(caretPosition.x3, caretPosition.y3);
      }
      getCaretPosition(tooltipPoint, size, options) {
        const {xAlign, yAlign} = this;
        const {caretSize, cornerRadius} = options;
        const {topLeft, topRight, bottomLeft, bottomRight} = toTRBLCorners(cornerRadius);
        const {x: ptX, y: ptY} = tooltipPoint;
        const {width, height} = size;
        let x1, x2, x3, y1, y2, y3;
        if (yAlign === 'center') {
          y2 = ptY + (height / 2);
          if (xAlign === 'left') {
            x1 = ptX;
            x2 = x1 - caretSize;
            y1 = y2 + caretSize;
            y3 = y2 - caretSize;
          } else {
            x1 = ptX + width;
            x2 = x1 + caretSize;
            y1 = y2 - caretSize;
            y3 = y2 + caretSize;
          }
          x3 = x1;
        } else {
          if (xAlign === 'left') {
            x2 = ptX + Math.max(topLeft, bottomLeft) + (caretSize);
          } else if (xAlign === 'right') {
            x2 = ptX + width - Math.max(topRight, bottomRight) - caretSize;
          } else {
            x2 = this.caretX;
          }
          if (yAlign === 'top') {
            y1 = ptY;
            y2 = y1 - caretSize;
            x1 = x2 - caretSize;
            x3 = x2 + caretSize;
          } else {
            y1 = ptY + height;
            y2 = y1 + caretSize;
            x1 = x2 + caretSize;
            x3 = x2 - caretSize;
          }
          y3 = y1;
        }
        return {x1, x2, x3, y1, y2, y3};
      }
      drawTitle(pt, ctx, options) {
        const title = this.title;
        const length = title.length;
        let titleFont, titleSpacing, i;
        if (length) {
          const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
          pt.x = getAlignedX(this, options.titleAlign, options);
          ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
          ctx.textBaseline = 'middle';
          titleFont = toFont(options.titleFont);
          titleSpacing = options.titleSpacing;
          ctx.fillStyle = options.titleColor;
          ctx.font = titleFont.string;
          for (i = 0; i < length; ++i) {
            ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
            pt.y += titleFont.lineHeight + titleSpacing;
            if (i + 1 === length) {
              pt.y += options.titleMarginBottom - titleSpacing;
            }
          }
        }
      }
      _drawColorBox(ctx, pt, i, rtlHelper, options) {
        const labelColors = this.labelColors[i];
        const labelPointStyle = this.labelPointStyles[i];
        const {boxHeight, boxWidth, boxPadding} = options;
        const bodyFont = toFont(options.bodyFont);
        const colorX = getAlignedX(this, 'left', options);
        const rtlColorX = rtlHelper.x(colorX);
        const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
        const colorY = pt.y + yOffSet;
        if (options.usePointStyle) {
          const drawOptions = {
            radius: Math.min(boxWidth, boxHeight) / 2,
            pointStyle: labelPointStyle.pointStyle,
            rotation: labelPointStyle.rotation,
            borderWidth: 1
          };
          const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
          const centerY = colorY + boxHeight / 2;
          ctx.strokeStyle = options.multiKeyBackground;
          ctx.fillStyle = options.multiKeyBackground;
          drawPoint(ctx, drawOptions, centerX, centerY);
          ctx.strokeStyle = labelColors.borderColor;
          ctx.fillStyle = labelColors.backgroundColor;
          drawPoint(ctx, drawOptions, centerX, centerY);
        } else {
          ctx.lineWidth = labelColors.borderWidth || 1;
          ctx.strokeStyle = labelColors.borderColor;
          ctx.setLineDash(labelColors.borderDash || []);
          ctx.lineDashOffset = labelColors.borderDashOffset || 0;
          const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth - boxPadding);
          const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - boxPadding - 2);
          const borderRadius = toTRBLCorners(labelColors.borderRadius);
          if (Object.values(borderRadius).some(v => v !== 0)) {
            ctx.beginPath();
            ctx.fillStyle = options.multiKeyBackground;
            addRoundedRectPath(ctx, {
              x: outerX,
              y: colorY,
              w: boxWidth,
              h: boxHeight,
              radius: borderRadius,
            });
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = labelColors.backgroundColor;
            ctx.beginPath();
            addRoundedRectPath(ctx, {
              x: innerX,
              y: colorY + 1,
              w: boxWidth - 2,
              h: boxHeight - 2,
              radius: borderRadius,
            });
            ctx.fill();
          } else {
            ctx.fillStyle = options.multiKeyBackground;
            ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
            ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
            ctx.fillStyle = labelColors.backgroundColor;
            ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
          }
        }
        ctx.fillStyle = this.labelTextColors[i];
      }
      drawBody(pt, ctx, options) {
        const {body} = this;
        const {bodySpacing, bodyAlign, displayColors, boxHeight, boxWidth, boxPadding} = options;
        const bodyFont = toFont(options.bodyFont);
        let bodyLineHeight = bodyFont.lineHeight;
        let xLinePadding = 0;
        const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
        const fillLineOfText = function(line) {
          ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
          pt.y += bodyLineHeight + bodySpacing;
        };
        const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
        let bodyItem, textColor, lines, i, j, ilen, jlen;
        ctx.textAlign = bodyAlign;
        ctx.textBaseline = 'middle';
        ctx.font = bodyFont.string;
        pt.x = getAlignedX(this, bodyAlignForCalculation, options);
        ctx.fillStyle = options.bodyColor;
        each(this.beforeBody, fillLineOfText);
        xLinePadding = displayColors && bodyAlignForCalculation !== 'right'
          ? bodyAlign === 'center' ? (boxWidth / 2 + boxPadding) : (boxWidth + 2 + boxPadding)
          : 0;
        for (i = 0, ilen = body.length; i < ilen; ++i) {
          bodyItem = body[i];
          textColor = this.labelTextColors[i];
          ctx.fillStyle = textColor;
          each(bodyItem.before, fillLineOfText);
          lines = bodyItem.lines;
          if (displayColors && lines.length) {
            this._drawColorBox(ctx, pt, i, rtlHelper, options);
            bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
          }
          for (j = 0, jlen = lines.length; j < jlen; ++j) {
            fillLineOfText(lines[j]);
            bodyLineHeight = bodyFont.lineHeight;
          }
          each(bodyItem.after, fillLineOfText);
        }
        xLinePadding = 0;
        bodyLineHeight = bodyFont.lineHeight;
        each(this.afterBody, fillLineOfText);
        pt.y -= bodySpacing;
      }
      drawFooter(pt, ctx, options) {
        const footer = this.footer;
        const length = footer.length;
        let footerFont, i;
        if (length) {
          const rtlHelper = getRtlAdapter(options.rtl, this.x, this.width);
          pt.x = getAlignedX(this, options.footerAlign, options);
          pt.y += options.footerMarginTop;
          ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
          ctx.textBaseline = 'middle';
          footerFont = toFont(options.footerFont);
          ctx.fillStyle = options.footerColor;
          ctx.font = footerFont.string;
          for (i = 0; i < length; ++i) {
            ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
            pt.y += footerFont.lineHeight + options.footerSpacing;
          }
        }
      }
      drawBackground(pt, ctx, tooltipSize, options) {
        const {xAlign, yAlign} = this;
        const {x, y} = pt;
        const {width, height} = tooltipSize;
        const {topLeft, topRight, bottomLeft, bottomRight} = toTRBLCorners(options.cornerRadius);
        ctx.fillStyle = options.backgroundColor;
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.beginPath();
        ctx.moveTo(x + topLeft, y);
        if (yAlign === 'top') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x + width - topRight, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
        if (yAlign === 'center' && xAlign === 'right') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x + width, y + height - bottomRight);
        ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
        if (yAlign === 'bottom') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x + bottomLeft, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - bottomLeft);
        if (yAlign === 'center' && xAlign === 'left') {
          this.drawCaret(pt, ctx, tooltipSize, options);
        }
        ctx.lineTo(x, y + topLeft);
        ctx.quadraticCurveTo(x, y, x + topLeft, y);
        ctx.closePath();
        ctx.fill();
        if (options.borderWidth > 0) {
          ctx.stroke();
        }
      }
      _updateAnimationTarget(options) {
        const chart = this.chart;
        const anims = this.$animations;
        const animX = anims && anims.x;
        const animY = anims && anims.y;
        if (animX || animY) {
          const position = positioners[options.position].call(this, this._active, this._eventPosition);
          if (!position) {
            return;
          }
          const size = this._size = getTooltipSize(this, options);
          const positionAndSize = Object.assign({}, position, this._size);
          const alignment = determineAlignment(chart, options, positionAndSize);
          const point = getBackgroundPoint(options, positionAndSize, alignment, chart);
          if (animX._to !== point.x || animY._to !== point.y) {
            this.xAlign = alignment.xAlign;
            this.yAlign = alignment.yAlign;
            this.width = size.width;
            this.height = size.height;
            this.caretX = position.x;
            this.caretY = position.y;
            this._resolveAnimations().update(this, point);
          }
        }
      }
      draw(ctx) {
        const options = this.options.setContext(this.getContext());
        let opacity = this.opacity;
        if (!opacity) {
          return;
        }
        this._updateAnimationTarget(options);
        const tooltipSize = {
          width: this.width,
          height: this.height
        };
        const pt = {
          x: this.x,
          y: this.y
        };
        opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
        const padding = toPadding(options.padding);
        const hasTooltipContent = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
        if (options.enabled && hasTooltipContent) {
          ctx.save();
          ctx.globalAlpha = opacity;
          this.drawBackground(pt, ctx, tooltipSize, options);
          overrideTextDirection(ctx, options.textDirection);
          pt.y += padding.top;
          this.drawTitle(pt, ctx, options);
          this.drawBody(pt, ctx, options);
          this.drawFooter(pt, ctx, options);
          restoreTextDirection(ctx, options.textDirection);
          ctx.restore();
        }
      }
      getActiveElements() {
        return this._active || [];
      }
      setActiveElements(activeElements, eventPosition) {
        const lastActive = this._active;
        const active = activeElements.map(({datasetIndex, index}) => {
          const meta = this.chart.getDatasetMeta(datasetIndex);
          if (!meta) {
            throw new Error('Cannot find a dataset at index ' + datasetIndex);
          }
          return {
            datasetIndex,
            element: meta.data[index],
            index,
          };
        });
        const changed = !_elementsEqual(lastActive, active);
        const positionChanged = this._positionChanged(active, eventPosition);
        if (changed || positionChanged) {
          this._active = active;
          this._eventPosition = eventPosition;
          this._ignoreReplayEvents = true;
          this.update(true);
        }
      }
      handleEvent(e, replay, inChartArea = true) {
        if (replay && this._ignoreReplayEvents) {
          return false;
        }
        this._ignoreReplayEvents = false;
        const options = this.options;
        const lastActive = this._active || [];
        const active = this._getActiveElements(e, lastActive, replay, inChartArea);
        const positionChanged = this._positionChanged(active, e);
        const changed = replay || !_elementsEqual(active, lastActive) || positionChanged;
        if (changed) {
          this._active = active;
          if (options.enabled || options.external) {
            this._eventPosition = {
              x: e.x,
              y: e.y
            };
            this.update(true, replay);
          }
        }
        return changed;
      }
      _getActiveElements(e, lastActive, replay, inChartArea) {
        const options = this.options;
        if (e.type === 'mouseout') {
          return [];
        }
        if (!inChartArea) {
          return lastActive;
        }
        const active = this.chart.getElementsAtEventForMode(e, options.mode, options, replay);
        if (options.reverse) {
          active.reverse();
        }
        return active;
      }
      _positionChanged(active, e) {
        const {caretX, caretY, options} = this;
        const position = positioners[options.position].call(this, active, e);
        return position !== false && (caretX !== position.x || caretY !== position.y);
      }
    }
    Tooltip.positioners = positioners;
    var plugin_tooltip = {
      id: 'tooltip',
      _element: Tooltip,
      positioners,
      afterInit(chart, _args, options) {
        if (options) {
          chart.tooltip = new Tooltip({chart, options});
        }
      },
      beforeUpdate(chart, _args, options) {
        if (chart.tooltip) {
          chart.tooltip.initialize(options);
        }
      },
      reset(chart, _args, options) {
        if (chart.tooltip) {
          chart.tooltip.initialize(options);
        }
      },
      afterDraw(chart) {
        const tooltip = chart.tooltip;
        const args = {
          tooltip
        };
        if (chart.notifyPlugins('beforeTooltipDraw', args) === false) {
          return;
        }
        if (tooltip) {
          tooltip.draw(chart.ctx);
        }
        chart.notifyPlugins('afterTooltipDraw', args);
      },
      afterEvent(chart, args) {
        if (chart.tooltip) {
          const useFinalPosition = args.replay;
          if (chart.tooltip.handleEvent(args.event, useFinalPosition, args.inChartArea)) {
            args.changed = true;
          }
        }
      },
      defaults: {
        enabled: true,
        external: null,
        position: 'average',
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        titleFont: {
          weight: 'bold',
        },
        titleSpacing: 2,
        titleMarginBottom: 6,
        titleAlign: 'left',
        bodyColor: '#fff',
        bodySpacing: 2,
        bodyFont: {
        },
        bodyAlign: 'left',
        footerColor: '#fff',
        footerSpacing: 2,
        footerMarginTop: 6,
        footerFont: {
          weight: 'bold',
        },
        footerAlign: 'left',
        padding: 6,
        caretPadding: 2,
        caretSize: 5,
        cornerRadius: 6,
        boxHeight: (ctx, opts) => opts.bodyFont.size,
        boxWidth: (ctx, opts) => opts.bodyFont.size,
        multiKeyBackground: '#fff',
        displayColors: true,
        boxPadding: 0,
        borderColor: 'rgba(0,0,0,0)',
        borderWidth: 0,
        animation: {
          duration: 400,
          easing: 'easeOutQuart',
        },
        animations: {
          numbers: {
            type: 'number',
            properties: ['x', 'y', 'width', 'height', 'caretX', 'caretY'],
          },
          opacity: {
            easing: 'linear',
            duration: 200
          }
        },
        callbacks: {
          beforeTitle: noop,
          title(tooltipItems) {
            if (tooltipItems.length > 0) {
              const item = tooltipItems[0];
              const labels = item.chart.data.labels;
              const labelCount = labels ? labels.length : 0;
              if (this && this.options && this.options.mode === 'dataset') {
                return item.dataset.label || '';
              } else if (item.label) {
                return item.label;
              } else if (labelCount > 0 && item.dataIndex < labelCount) {
                return labels[item.dataIndex];
              }
            }
            return '';
          },
          afterTitle: noop,
          beforeBody: noop,
          beforeLabel: noop,
          label(tooltipItem) {
            if (this && this.options && this.options.mode === 'dataset') {
              return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
            }
            let label = tooltipItem.dataset.label || '';
            if (label) {
              label += ': ';
            }
            const value = tooltipItem.formattedValue;
            if (!isNullOrUndef(value)) {
              label += value;
            }
            return label;
          },
          labelColor(tooltipItem) {
            const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
            const options = meta.controller.getStyle(tooltipItem.dataIndex);
            return {
              borderColor: options.borderColor,
              backgroundColor: options.backgroundColor,
              borderWidth: options.borderWidth,
              borderDash: options.borderDash,
              borderDashOffset: options.borderDashOffset,
              borderRadius: 0,
            };
          },
          labelTextColor() {
            return this.options.bodyColor;
          },
          labelPointStyle(tooltipItem) {
            const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
            const options = meta.controller.getStyle(tooltipItem.dataIndex);
            return {
              pointStyle: options.pointStyle,
              rotation: options.rotation,
            };
          },
          afterLabel: noop,
          afterBody: noop,
          beforeFooter: noop,
          footer: noop,
          afterFooter: noop
        }
      },
      defaultRoutes: {
        bodyFont: 'font',
        footerFont: 'font',
        titleFont: 'font'
      },
      descriptors: {
        _scriptable: (name) => name !== 'filter' && name !== 'itemSort' && name !== 'external',
        _indexable: false,
        callbacks: {
          _scriptable: false,
          _indexable: false,
        },
        animation: {
          _fallback: false
        },
        animations: {
          _fallback: 'animation'
        }
      },
      additionalOptionScopes: ['interaction']
    };

    const addIfString = (labels, raw, index, addedLabels) => {
      if (typeof raw === 'string') {
        index = labels.push(raw) - 1;
        addedLabels.unshift({index, label: raw});
      } else if (isNaN(raw)) {
        index = null;
      }
      return index;
    };
    function findOrAddLabel(labels, raw, index, addedLabels) {
      const first = labels.indexOf(raw);
      if (first === -1) {
        return addIfString(labels, raw, index, addedLabels);
      }
      const last = labels.lastIndexOf(raw);
      return first !== last ? index : first;
    }
    const validIndex = (index, max) => index === null ? null : _limitValue(Math.round(index), 0, max);
    class CategoryScale extends Scale {
      constructor(cfg) {
        super(cfg);
        this._startValue = undefined;
        this._valueRange = 0;
        this._addedLabels = [];
      }
      init(scaleOptions) {
        const added = this._addedLabels;
        if (added.length) {
          const labels = this.getLabels();
          for (const {index, label} of added) {
            if (labels[index] === label) {
              labels.splice(index, 1);
            }
          }
          this._addedLabels = [];
        }
        super.init(scaleOptions);
      }
      parse(raw, index) {
        if (isNullOrUndef(raw)) {
          return null;
        }
        const labels = this.getLabels();
        index = isFinite(index) && labels[index] === raw ? index
          : findOrAddLabel(labels, raw, valueOrDefault(index, raw), this._addedLabels);
        return validIndex(index, labels.length - 1);
      }
      determineDataLimits() {
        const {minDefined, maxDefined} = this.getUserBounds();
        let {min, max} = this.getMinMax(true);
        if (this.options.bounds === 'ticks') {
          if (!minDefined) {
            min = 0;
          }
          if (!maxDefined) {
            max = this.getLabels().length - 1;
          }
        }
        this.min = min;
        this.max = max;
      }
      buildTicks() {
        const min = this.min;
        const max = this.max;
        const offset = this.options.offset;
        const ticks = [];
        let labels = this.getLabels();
        labels = (min === 0 && max === labels.length - 1) ? labels : labels.slice(min, max + 1);
        this._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
        this._startValue = this.min - (offset ? 0.5 : 0);
        for (let value = min; value <= max; value++) {
          ticks.push({value});
        }
        return ticks;
      }
      getLabelForValue(value) {
        const labels = this.getLabels();
        if (value >= 0 && value < labels.length) {
          return labels[value];
        }
        return value;
      }
      configure() {
        super.configure();
        if (!this.isHorizontal()) {
          this._reversePixels = !this._reversePixels;
        }
      }
      getPixelForValue(value) {
        if (typeof value !== 'number') {
          value = this.parse(value);
        }
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
      }
      getPixelForTick(index) {
        const ticks = this.ticks;
        if (index < 0 || index > ticks.length - 1) {
          return null;
        }
        return this.getPixelForValue(ticks[index].value);
      }
      getValueForPixel(pixel) {
        return Math.round(this._startValue + this.getDecimalForPixel(pixel) * this._valueRange);
      }
      getBasePixel() {
        return this.bottom;
      }
    }
    CategoryScale.id = 'category';
    CategoryScale.defaults = {
      ticks: {
        callback: CategoryScale.prototype.getLabelForValue
      }
    };

    function generateTicks$1(generationOptions, dataRange) {
      const ticks = [];
      const MIN_SPACING = 1e-14;
      const {bounds, step, min, max, precision, count, maxTicks, maxDigits, includeBounds} = generationOptions;
      const unit = step || 1;
      const maxSpaces = maxTicks - 1;
      const {min: rmin, max: rmax} = dataRange;
      const minDefined = !isNullOrUndef(min);
      const maxDefined = !isNullOrUndef(max);
      const countDefined = !isNullOrUndef(count);
      const minSpacing = (rmax - rmin) / (maxDigits + 1);
      let spacing = niceNum((rmax - rmin) / maxSpaces / unit) * unit;
      let factor, niceMin, niceMax, numSpaces;
      if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
        return [{value: rmin}, {value: rmax}];
      }
      numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);
      if (numSpaces > maxSpaces) {
        spacing = niceNum(numSpaces * spacing / maxSpaces / unit) * unit;
      }
      if (!isNullOrUndef(precision)) {
        factor = Math.pow(10, precision);
        spacing = Math.ceil(spacing * factor) / factor;
      }
      if (bounds === 'ticks') {
        niceMin = Math.floor(rmin / spacing) * spacing;
        niceMax = Math.ceil(rmax / spacing) * spacing;
      } else {
        niceMin = rmin;
        niceMax = rmax;
      }
      if (minDefined && maxDefined && step && almostWhole((max - min) / step, spacing / 1000)) {
        numSpaces = Math.round(Math.min((max - min) / spacing, maxTicks));
        spacing = (max - min) / numSpaces;
        niceMin = min;
        niceMax = max;
      } else if (countDefined) {
        niceMin = minDefined ? min : niceMin;
        niceMax = maxDefined ? max : niceMax;
        numSpaces = count - 1;
        spacing = (niceMax - niceMin) / numSpaces;
      } else {
        numSpaces = (niceMax - niceMin) / spacing;
        if (almostEquals(numSpaces, Math.round(numSpaces), spacing / 1000)) {
          numSpaces = Math.round(numSpaces);
        } else {
          numSpaces = Math.ceil(numSpaces);
        }
      }
      const decimalPlaces = Math.max(
        _decimalPlaces(spacing),
        _decimalPlaces(niceMin)
      );
      factor = Math.pow(10, isNullOrUndef(precision) ? decimalPlaces : precision);
      niceMin = Math.round(niceMin * factor) / factor;
      niceMax = Math.round(niceMax * factor) / factor;
      let j = 0;
      if (minDefined) {
        if (includeBounds && niceMin !== min) {
          ticks.push({value: min});
          if (niceMin < min) {
            j++;
          }
          if (almostEquals(Math.round((niceMin + j * spacing) * factor) / factor, min, relativeLabelSize(min, minSpacing, generationOptions))) {
            j++;
          }
        } else if (niceMin < min) {
          j++;
        }
      }
      for (; j < numSpaces; ++j) {
        ticks.push({value: Math.round((niceMin + j * spacing) * factor) / factor});
      }
      if (maxDefined && includeBounds && niceMax !== max) {
        if (ticks.length && almostEquals(ticks[ticks.length - 1].value, max, relativeLabelSize(max, minSpacing, generationOptions))) {
          ticks[ticks.length - 1].value = max;
        } else {
          ticks.push({value: max});
        }
      } else if (!maxDefined || niceMax === max) {
        ticks.push({value: niceMax});
      }
      return ticks;
    }
    function relativeLabelSize(value, minSpacing, {horizontal, minRotation}) {
      const rad = toRadians(minRotation);
      const ratio = (horizontal ? Math.sin(rad) : Math.cos(rad)) || 0.001;
      const length = 0.75 * minSpacing * ('' + value).length;
      return Math.min(minSpacing / ratio, length);
    }
    class LinearScaleBase extends Scale {
      constructor(cfg) {
        super(cfg);
        this.start = undefined;
        this.end = undefined;
        this._startValue = undefined;
        this._endValue = undefined;
        this._valueRange = 0;
      }
      parse(raw, index) {
        if (isNullOrUndef(raw)) {
          return null;
        }
        if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
          return null;
        }
        return +raw;
      }
      handleTickRangeOptions() {
        const {beginAtZero} = this.options;
        const {minDefined, maxDefined} = this.getUserBounds();
        let {min, max} = this;
        const setMin = v => (min = minDefined ? min : v);
        const setMax = v => (max = maxDefined ? max : v);
        if (beginAtZero) {
          const minSign = sign(min);
          const maxSign = sign(max);
          if (minSign < 0 && maxSign < 0) {
            setMax(0);
          } else if (minSign > 0 && maxSign > 0) {
            setMin(0);
          }
        }
        if (min === max) {
          let offset = 1;
          if (max >= Number.MAX_SAFE_INTEGER || min <= Number.MIN_SAFE_INTEGER) {
            offset = Math.abs(max * 0.05);
          }
          setMax(max + offset);
          if (!beginAtZero) {
            setMin(min - offset);
          }
        }
        this.min = min;
        this.max = max;
      }
      getTickLimit() {
        const tickOpts = this.options.ticks;
        let {maxTicksLimit, stepSize} = tickOpts;
        let maxTicks;
        if (stepSize) {
          maxTicks = Math.ceil(this.max / stepSize) - Math.floor(this.min / stepSize) + 1;
          if (maxTicks > 1000) {
            console.warn(`scales.${this.id}.ticks.stepSize: ${stepSize} would result generating up to ${maxTicks} ticks. Limiting to 1000.`);
            maxTicks = 1000;
          }
        } else {
          maxTicks = this.computeTickLimit();
          maxTicksLimit = maxTicksLimit || 11;
        }
        if (maxTicksLimit) {
          maxTicks = Math.min(maxTicksLimit, maxTicks);
        }
        return maxTicks;
      }
      computeTickLimit() {
        return Number.POSITIVE_INFINITY;
      }
      buildTicks() {
        const opts = this.options;
        const tickOpts = opts.ticks;
        let maxTicks = this.getTickLimit();
        maxTicks = Math.max(2, maxTicks);
        const numericGeneratorOptions = {
          maxTicks,
          bounds: opts.bounds,
          min: opts.min,
          max: opts.max,
          precision: tickOpts.precision,
          step: tickOpts.stepSize,
          count: tickOpts.count,
          maxDigits: this._maxDigits(),
          horizontal: this.isHorizontal(),
          minRotation: tickOpts.minRotation || 0,
          includeBounds: tickOpts.includeBounds !== false
        };
        const dataRange = this._range || this;
        const ticks = generateTicks$1(numericGeneratorOptions, dataRange);
        if (opts.bounds === 'ticks') {
          _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
          ticks.reverse();
          this.start = this.max;
          this.end = this.min;
        } else {
          this.start = this.min;
          this.end = this.max;
        }
        return ticks;
      }
      configure() {
        const ticks = this.ticks;
        let start = this.min;
        let end = this.max;
        super.configure();
        if (this.options.offset && ticks.length) {
          const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
          start -= offset;
          end += offset;
        }
        this._startValue = start;
        this._endValue = end;
        this._valueRange = end - start;
      }
      getLabelForValue(value) {
        return formatNumber(value, this.chart.options.locale, this.options.ticks.format);
      }
    }

    class LinearScale extends LinearScaleBase {
      determineDataLimits() {
        const {min, max} = this.getMinMax(true);
        this.min = isNumberFinite(min) ? min : 0;
        this.max = isNumberFinite(max) ? max : 1;
        this.handleTickRangeOptions();
      }
      computeTickLimit() {
        const horizontal = this.isHorizontal();
        const length = horizontal ? this.width : this.height;
        const minRotation = toRadians(this.options.ticks.minRotation);
        const ratio = (horizontal ? Math.sin(minRotation) : Math.cos(minRotation)) || 0.001;
        const tickFont = this._resolveTickFontOptions(0);
        return Math.ceil(length / Math.min(40, tickFont.lineHeight / ratio));
      }
      getPixelForValue(value) {
        return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
      }
      getValueForPixel(pixel) {
        return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
      }
    }
    LinearScale.id = 'linear';
    LinearScale.defaults = {
      ticks: {
        callback: Ticks.formatters.numeric
      }
    };

    function isMajor(tickVal) {
      const remain = tickVal / (Math.pow(10, Math.floor(log10(tickVal))));
      return remain === 1;
    }
    function generateTicks(generationOptions, dataRange) {
      const endExp = Math.floor(log10(dataRange.max));
      const endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
      const ticks = [];
      let tickVal = finiteOrDefault(generationOptions.min, Math.pow(10, Math.floor(log10(dataRange.min))));
      let exp = Math.floor(log10(tickVal));
      let significand = Math.floor(tickVal / Math.pow(10, exp));
      let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;
      do {
        ticks.push({value: tickVal, major: isMajor(tickVal)});
        ++significand;
        if (significand === 10) {
          significand = 1;
          ++exp;
          precision = exp >= 0 ? 1 : precision;
        }
        tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
      } while (exp < endExp || (exp === endExp && significand < endSignificand));
      const lastTick = finiteOrDefault(generationOptions.max, tickVal);
      ticks.push({value: lastTick, major: isMajor(tickVal)});
      return ticks;
    }
    class LogarithmicScale extends Scale {
      constructor(cfg) {
        super(cfg);
        this.start = undefined;
        this.end = undefined;
        this._startValue = undefined;
        this._valueRange = 0;
      }
      parse(raw, index) {
        const value = LinearScaleBase.prototype.parse.apply(this, [raw, index]);
        if (value === 0) {
          this._zero = true;
          return undefined;
        }
        return isNumberFinite(value) && value > 0 ? value : null;
      }
      determineDataLimits() {
        const {min, max} = this.getMinMax(true);
        this.min = isNumberFinite(min) ? Math.max(0, min) : null;
        this.max = isNumberFinite(max) ? Math.max(0, max) : null;
        if (this.options.beginAtZero) {
          this._zero = true;
        }
        this.handleTickRangeOptions();
      }
      handleTickRangeOptions() {
        const {minDefined, maxDefined} = this.getUserBounds();
        let min = this.min;
        let max = this.max;
        const setMin = v => (min = minDefined ? min : v);
        const setMax = v => (max = maxDefined ? max : v);
        const exp = (v, m) => Math.pow(10, Math.floor(log10(v)) + m);
        if (min === max) {
          if (min <= 0) {
            setMin(1);
            setMax(10);
          } else {
            setMin(exp(min, -1));
            setMax(exp(max, +1));
          }
        }
        if (min <= 0) {
          setMin(exp(max, -1));
        }
        if (max <= 0) {
          setMax(exp(min, +1));
        }
        if (this._zero && this.min !== this._suggestedMin && min === exp(this.min, 0)) {
          setMin(exp(min, -1));
        }
        this.min = min;
        this.max = max;
      }
      buildTicks() {
        const opts = this.options;
        const generationOptions = {
          min: this._userMin,
          max: this._userMax
        };
        const ticks = generateTicks(generationOptions, this);
        if (opts.bounds === 'ticks') {
          _setMinAndMaxByKey(ticks, this, 'value');
        }
        if (opts.reverse) {
          ticks.reverse();
          this.start = this.max;
          this.end = this.min;
        } else {
          this.start = this.min;
          this.end = this.max;
        }
        return ticks;
      }
      getLabelForValue(value) {
        return value === undefined
          ? '0'
          : formatNumber(value, this.chart.options.locale, this.options.ticks.format);
      }
      configure() {
        const start = this.min;
        super.configure();
        this._startValue = log10(start);
        this._valueRange = log10(this.max) - log10(start);
      }
      getPixelForValue(value) {
        if (value === undefined || value === 0) {
          value = this.min;
        }
        if (value === null || isNaN(value)) {
          return NaN;
        }
        return this.getPixelForDecimal(value === this.min
          ? 0
          : (log10(value) - this._startValue) / this._valueRange);
      }
      getValueForPixel(pixel) {
        const decimal = this.getDecimalForPixel(pixel);
        return Math.pow(10, this._startValue + decimal * this._valueRange);
      }
    }
    LogarithmicScale.id = 'logarithmic';
    LogarithmicScale.defaults = {
      ticks: {
        callback: Ticks.formatters.logarithmic,
        major: {
          enabled: true
        }
      }
    };

    function getTickBackdropHeight(opts) {
      const tickOpts = opts.ticks;
      if (tickOpts.display && opts.display) {
        const padding = toPadding(tickOpts.backdropPadding);
        return valueOrDefault(tickOpts.font && tickOpts.font.size, defaults.font.size) + padding.height;
      }
      return 0;
    }
    function measureLabelSize(ctx, font, label) {
      label = isArray(label) ? label : [label];
      return {
        w: _longestText(ctx, font.string, label),
        h: label.length * font.lineHeight
      };
    }
    function determineLimits(angle, pos, size, min, max) {
      if (angle === min || angle === max) {
        return {
          start: pos - (size / 2),
          end: pos + (size / 2)
        };
      } else if (angle < min || angle > max) {
        return {
          start: pos - size,
          end: pos
        };
      }
      return {
        start: pos,
        end: pos + size
      };
    }
    function fitWithPointLabels(scale) {
      const orig = {
        l: scale.left + scale._padding.left,
        r: scale.right - scale._padding.right,
        t: scale.top + scale._padding.top,
        b: scale.bottom - scale._padding.bottom
      };
      const limits = Object.assign({}, orig);
      const labelSizes = [];
      const padding = [];
      const valueCount = scale._pointLabels.length;
      const pointLabelOpts = scale.options.pointLabels;
      const additionalAngle = pointLabelOpts.centerPointLabels ? PI / valueCount : 0;
      for (let i = 0; i < valueCount; i++) {
        const opts = pointLabelOpts.setContext(scale.getPointLabelContext(i));
        padding[i] = opts.padding;
        const pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i], additionalAngle);
        const plFont = toFont(opts.font);
        const textSize = measureLabelSize(scale.ctx, plFont, scale._pointLabels[i]);
        labelSizes[i] = textSize;
        const angleRadians = _normalizeAngle(scale.getIndexAngle(i) + additionalAngle);
        const angle = Math.round(toDegrees(angleRadians));
        const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
        const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);
        updateLimits(limits, orig, angleRadians, hLimits, vLimits);
      }
      scale.setCenterPoint(
        orig.l - limits.l,
        limits.r - orig.r,
        orig.t - limits.t,
        limits.b - orig.b
      );
      scale._pointLabelItems = buildPointLabelItems(scale, labelSizes, padding);
    }
    function updateLimits(limits, orig, angle, hLimits, vLimits) {
      const sin = Math.abs(Math.sin(angle));
      const cos = Math.abs(Math.cos(angle));
      let x = 0;
      let y = 0;
      if (hLimits.start < orig.l) {
        x = (orig.l - hLimits.start) / sin;
        limits.l = Math.min(limits.l, orig.l - x);
      } else if (hLimits.end > orig.r) {
        x = (hLimits.end - orig.r) / sin;
        limits.r = Math.max(limits.r, orig.r + x);
      }
      if (vLimits.start < orig.t) {
        y = (orig.t - vLimits.start) / cos;
        limits.t = Math.min(limits.t, orig.t - y);
      } else if (vLimits.end > orig.b) {
        y = (vLimits.end - orig.b) / cos;
        limits.b = Math.max(limits.b, orig.b + y);
      }
    }
    function buildPointLabelItems(scale, labelSizes, padding) {
      const items = [];
      const valueCount = scale._pointLabels.length;
      const opts = scale.options;
      const extra = getTickBackdropHeight(opts) / 2;
      const outerDistance = scale.drawingArea;
      const additionalAngle = opts.pointLabels.centerPointLabels ? PI / valueCount : 0;
      for (let i = 0; i < valueCount; i++) {
        const pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + padding[i], additionalAngle);
        const angle = Math.round(toDegrees(_normalizeAngle(pointLabelPosition.angle + HALF_PI)));
        const size = labelSizes[i];
        const y = yForAngle(pointLabelPosition.y, size.h, angle);
        const textAlign = getTextAlignForAngle(angle);
        const left = leftForTextAlign(pointLabelPosition.x, size.w, textAlign);
        items.push({
          x: pointLabelPosition.x,
          y,
          textAlign,
          left,
          top: y,
          right: left + size.w,
          bottom: y + size.h
        });
      }
      return items;
    }
    function getTextAlignForAngle(angle) {
      if (angle === 0 || angle === 180) {
        return 'center';
      } else if (angle < 180) {
        return 'left';
      }
      return 'right';
    }
    function leftForTextAlign(x, w, align) {
      if (align === 'right') {
        x -= w;
      } else if (align === 'center') {
        x -= (w / 2);
      }
      return x;
    }
    function yForAngle(y, h, angle) {
      if (angle === 90 || angle === 270) {
        y -= (h / 2);
      } else if (angle > 270 || angle < 90) {
        y -= h;
      }
      return y;
    }
    function drawPointLabels(scale, labelCount) {
      const {ctx, options: {pointLabels}} = scale;
      for (let i = labelCount - 1; i >= 0; i--) {
        const optsAtIndex = pointLabels.setContext(scale.getPointLabelContext(i));
        const plFont = toFont(optsAtIndex.font);
        const {x, y, textAlign, left, top, right, bottom} = scale._pointLabelItems[i];
        const {backdropColor} = optsAtIndex;
        if (!isNullOrUndef(backdropColor)) {
          const padding = toPadding(optsAtIndex.backdropPadding);
          ctx.fillStyle = backdropColor;
          ctx.fillRect(left - padding.left, top - padding.top, right - left + padding.width, bottom - top + padding.height);
        }
        renderText(
          ctx,
          scale._pointLabels[i],
          x,
          y + (plFont.lineHeight / 2),
          plFont,
          {
            color: optsAtIndex.color,
            textAlign: textAlign,
            textBaseline: 'middle'
          }
        );
      }
    }
    function pathRadiusLine(scale, radius, circular, labelCount) {
      const {ctx} = scale;
      if (circular) {
        ctx.arc(scale.xCenter, scale.yCenter, radius, 0, TAU);
      } else {
        let pointPosition = scale.getPointPosition(0, radius);
        ctx.moveTo(pointPosition.x, pointPosition.y);
        for (let i = 1; i < labelCount; i++) {
          pointPosition = scale.getPointPosition(i, radius);
          ctx.lineTo(pointPosition.x, pointPosition.y);
        }
      }
    }
    function drawRadiusLine(scale, gridLineOpts, radius, labelCount) {
      const ctx = scale.ctx;
      const circular = gridLineOpts.circular;
      const {color, lineWidth} = gridLineOpts;
      if ((!circular && !labelCount) || !color || !lineWidth || radius < 0) {
        return;
      }
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.setLineDash(gridLineOpts.borderDash);
      ctx.lineDashOffset = gridLineOpts.borderDashOffset;
      ctx.beginPath();
      pathRadiusLine(scale, radius, circular, labelCount);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
    function createPointLabelContext(parent, index, label) {
      return createContext(parent, {
        label,
        index,
        type: 'pointLabel'
      });
    }
    class RadialLinearScale extends LinearScaleBase {
      constructor(cfg) {
        super(cfg);
        this.xCenter = undefined;
        this.yCenter = undefined;
        this.drawingArea = undefined;
        this._pointLabels = [];
        this._pointLabelItems = [];
      }
      setDimensions() {
        const padding = this._padding = toPadding(getTickBackdropHeight(this.options) / 2);
        const w = this.width = this.maxWidth - padding.width;
        const h = this.height = this.maxHeight - padding.height;
        this.xCenter = Math.floor(this.left + w / 2 + padding.left);
        this.yCenter = Math.floor(this.top + h / 2 + padding.top);
        this.drawingArea = Math.floor(Math.min(w, h) / 2);
      }
      determineDataLimits() {
        const {min, max} = this.getMinMax(false);
        this.min = isNumberFinite(min) && !isNaN(min) ? min : 0;
        this.max = isNumberFinite(max) && !isNaN(max) ? max : 0;
        this.handleTickRangeOptions();
      }
      computeTickLimit() {
        return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
      }
      generateTickLabels(ticks) {
        LinearScaleBase.prototype.generateTickLabels.call(this, ticks);
        this._pointLabels = this.getLabels()
          .map((value, index) => {
            const label = callback(this.options.pointLabels.callback, [value, index], this);
            return label || label === 0 ? label : '';
          })
          .filter((v, i) => this.chart.getDataVisibility(i));
      }
      fit() {
        const opts = this.options;
        if (opts.display && opts.pointLabels.display) {
          fitWithPointLabels(this);
        } else {
          this.setCenterPoint(0, 0, 0, 0);
        }
      }
      setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
        this.xCenter += Math.floor((leftMovement - rightMovement) / 2);
        this.yCenter += Math.floor((topMovement - bottomMovement) / 2);
        this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(leftMovement, rightMovement, topMovement, bottomMovement));
      }
      getIndexAngle(index) {
        const angleMultiplier = TAU / (this._pointLabels.length || 1);
        const startAngle = this.options.startAngle || 0;
        return _normalizeAngle(index * angleMultiplier + toRadians(startAngle));
      }
      getDistanceFromCenterForValue(value) {
        if (isNullOrUndef(value)) {
          return NaN;
        }
        const scalingFactor = this.drawingArea / (this.max - this.min);
        if (this.options.reverse) {
          return (this.max - value) * scalingFactor;
        }
        return (value - this.min) * scalingFactor;
      }
      getValueForDistanceFromCenter(distance) {
        if (isNullOrUndef(distance)) {
          return NaN;
        }
        const scaledDistance = distance / (this.drawingArea / (this.max - this.min));
        return this.options.reverse ? this.max - scaledDistance : this.min + scaledDistance;
      }
      getPointLabelContext(index) {
        const pointLabels = this._pointLabels || [];
        if (index >= 0 && index < pointLabels.length) {
          const pointLabel = pointLabels[index];
          return createPointLabelContext(this.getContext(), index, pointLabel);
        }
      }
      getPointPosition(index, distanceFromCenter, additionalAngle = 0) {
        const angle = this.getIndexAngle(index) - HALF_PI + additionalAngle;
        return {
          x: Math.cos(angle) * distanceFromCenter + this.xCenter,
          y: Math.sin(angle) * distanceFromCenter + this.yCenter,
          angle
        };
      }
      getPointPositionForValue(index, value) {
        return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
      }
      getBasePosition(index) {
        return this.getPointPositionForValue(index || 0, this.getBaseValue());
      }
      getPointLabelPosition(index) {
        const {left, top, right, bottom} = this._pointLabelItems[index];
        return {
          left,
          top,
          right,
          bottom,
        };
      }
      drawBackground() {
        const {backgroundColor, grid: {circular}} = this.options;
        if (backgroundColor) {
          const ctx = this.ctx;
          ctx.save();
          ctx.beginPath();
          pathRadiusLine(this, this.getDistanceFromCenterForValue(this._endValue), circular, this._pointLabels.length);
          ctx.closePath();
          ctx.fillStyle = backgroundColor;
          ctx.fill();
          ctx.restore();
        }
      }
      drawGrid() {
        const ctx = this.ctx;
        const opts = this.options;
        const {angleLines, grid} = opts;
        const labelCount = this._pointLabels.length;
        let i, offset, position;
        if (opts.pointLabels.display) {
          drawPointLabels(this, labelCount);
        }
        if (grid.display) {
          this.ticks.forEach((tick, index) => {
            if (index !== 0) {
              offset = this.getDistanceFromCenterForValue(tick.value);
              const optsAtIndex = grid.setContext(this.getContext(index - 1));
              drawRadiusLine(this, optsAtIndex, offset, labelCount);
            }
          });
        }
        if (angleLines.display) {
          ctx.save();
          for (i = labelCount - 1; i >= 0; i--) {
            const optsAtIndex = angleLines.setContext(this.getPointLabelContext(i));
            const {color, lineWidth} = optsAtIndex;
            if (!lineWidth || !color) {
              continue;
            }
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.setLineDash(optsAtIndex.borderDash);
            ctx.lineDashOffset = optsAtIndex.borderDashOffset;
            offset = this.getDistanceFromCenterForValue(opts.ticks.reverse ? this.min : this.max);
            position = this.getPointPosition(i, offset);
            ctx.beginPath();
            ctx.moveTo(this.xCenter, this.yCenter);
            ctx.lineTo(position.x, position.y);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      drawBorder() {}
      drawLabels() {
        const ctx = this.ctx;
        const opts = this.options;
        const tickOpts = opts.ticks;
        if (!tickOpts.display) {
          return;
        }
        const startAngle = this.getIndexAngle(0);
        let offset, width;
        ctx.save();
        ctx.translate(this.xCenter, this.yCenter);
        ctx.rotate(startAngle);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        this.ticks.forEach((tick, index) => {
          if (index === 0 && !opts.reverse) {
            return;
          }
          const optsAtIndex = tickOpts.setContext(this.getContext(index));
          const tickFont = toFont(optsAtIndex.font);
          offset = this.getDistanceFromCenterForValue(this.ticks[index].value);
          if (optsAtIndex.showLabelBackdrop) {
            ctx.font = tickFont.string;
            width = ctx.measureText(tick.label).width;
            ctx.fillStyle = optsAtIndex.backdropColor;
            const padding = toPadding(optsAtIndex.backdropPadding);
            ctx.fillRect(
              -width / 2 - padding.left,
              -offset - tickFont.size / 2 - padding.top,
              width + padding.width,
              tickFont.size + padding.height
            );
          }
          renderText(ctx, tick.label, 0, -offset, tickFont, {
            color: optsAtIndex.color,
          });
        });
        ctx.restore();
      }
      drawTitle() {}
    }
    RadialLinearScale.id = 'radialLinear';
    RadialLinearScale.defaults = {
      display: true,
      animate: true,
      position: 'chartArea',
      angleLines: {
        display: true,
        lineWidth: 1,
        borderDash: [],
        borderDashOffset: 0.0
      },
      grid: {
        circular: false
      },
      startAngle: 0,
      ticks: {
        showLabelBackdrop: true,
        callback: Ticks.formatters.numeric
      },
      pointLabels: {
        backdropColor: undefined,
        backdropPadding: 2,
        display: true,
        font: {
          size: 10
        },
        callback(label) {
          return label;
        },
        padding: 5,
        centerPointLabels: false
      }
    };
    RadialLinearScale.defaultRoutes = {
      'angleLines.color': 'borderColor',
      'pointLabels.color': 'color',
      'ticks.color': 'color'
    };
    RadialLinearScale.descriptors = {
      angleLines: {
        _fallback: 'grid'
      }
    };

    const INTERVALS = {
      millisecond: {common: true, size: 1, steps: 1000},
      second: {common: true, size: 1000, steps: 60},
      minute: {common: true, size: 60000, steps: 60},
      hour: {common: true, size: 3600000, steps: 24},
      day: {common: true, size: 86400000, steps: 30},
      week: {common: false, size: 604800000, steps: 4},
      month: {common: true, size: 2.628e9, steps: 12},
      quarter: {common: false, size: 7.884e9, steps: 4},
      year: {common: true, size: 3.154e10}
    };
    const UNITS = (Object.keys(INTERVALS));
    function sorter(a, b) {
      return a - b;
    }
    function parse(scale, input) {
      if (isNullOrUndef(input)) {
        return null;
      }
      const adapter = scale._adapter;
      const {parser, round, isoWeekday} = scale._parseOpts;
      let value = input;
      if (typeof parser === 'function') {
        value = parser(value);
      }
      if (!isNumberFinite(value)) {
        value = typeof parser === 'string'
          ? adapter.parse(value, parser)
          : adapter.parse(value);
      }
      if (value === null) {
        return null;
      }
      if (round) {
        value = round === 'week' && (isNumber(isoWeekday) || isoWeekday === true)
          ? adapter.startOf(value, 'isoWeek', isoWeekday)
          : adapter.startOf(value, round);
      }
      return +value;
    }
    function determineUnitForAutoTicks(minUnit, min, max, capacity) {
      const ilen = UNITS.length;
      for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
        const interval = INTERVALS[UNITS[i]];
        const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;
        if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
          return UNITS[i];
        }
      }
      return UNITS[ilen - 1];
    }
    function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
      for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
        const unit = UNITS[i];
        if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
          return unit;
        }
      }
      return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
    }
    function determineMajorUnit(unit) {
      for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
        if (INTERVALS[UNITS[i]].common) {
          return UNITS[i];
        }
      }
    }
    function addTick(ticks, time, timestamps) {
      if (!timestamps) {
        ticks[time] = true;
      } else if (timestamps.length) {
        const {lo, hi} = _lookup(timestamps, time);
        const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
        ticks[timestamp] = true;
      }
    }
    function setMajorTicks(scale, ticks, map, majorUnit) {
      const adapter = scale._adapter;
      const first = +adapter.startOf(ticks[0].value, majorUnit);
      const last = ticks[ticks.length - 1].value;
      let major, index;
      for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
        index = map[major];
        if (index >= 0) {
          ticks[index].major = true;
        }
      }
      return ticks;
    }
    function ticksFromTimestamps(scale, values, majorUnit) {
      const ticks = [];
      const map = {};
      const ilen = values.length;
      let i, value;
      for (i = 0; i < ilen; ++i) {
        value = values[i];
        map[value] = i;
        ticks.push({
          value,
          major: false
        });
      }
      return (ilen === 0 || !majorUnit) ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
    }
    class TimeScale extends Scale {
      constructor(props) {
        super(props);
        this._cache = {
          data: [],
          labels: [],
          all: []
        };
        this._unit = 'day';
        this._majorUnit = undefined;
        this._offsets = {};
        this._normalized = false;
        this._parseOpts = undefined;
      }
      init(scaleOpts, opts) {
        const time = scaleOpts.time || (scaleOpts.time = {});
        const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
        mergeIf(time.displayFormats, adapter.formats());
        this._parseOpts = {
          parser: time.parser,
          round: time.round,
          isoWeekday: time.isoWeekday
        };
        super.init(scaleOpts);
        this._normalized = opts.normalized;
      }
      parse(raw, index) {
        if (raw === undefined) {
          return null;
        }
        return parse(this, raw);
      }
      beforeLayout() {
        super.beforeLayout();
        this._cache = {
          data: [],
          labels: [],
          all: []
        };
      }
      determineDataLimits() {
        const options = this.options;
        const adapter = this._adapter;
        const unit = options.time.unit || 'day';
        let {min, max, minDefined, maxDefined} = this.getUserBounds();
        function _applyBounds(bounds) {
          if (!minDefined && !isNaN(bounds.min)) {
            min = Math.min(min, bounds.min);
          }
          if (!maxDefined && !isNaN(bounds.max)) {
            max = Math.max(max, bounds.max);
          }
        }
        if (!minDefined || !maxDefined) {
          _applyBounds(this._getLabelBounds());
          if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
            _applyBounds(this.getMinMax(false));
          }
        }
        min = isNumberFinite(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
        max = isNumberFinite(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
        this.min = Math.min(min, max - 1);
        this.max = Math.max(min + 1, max);
      }
      _getLabelBounds() {
        const arr = this.getLabelTimestamps();
        let min = Number.POSITIVE_INFINITY;
        let max = Number.NEGATIVE_INFINITY;
        if (arr.length) {
          min = arr[0];
          max = arr[arr.length - 1];
        }
        return {min, max};
      }
      buildTicks() {
        const options = this.options;
        const timeOpts = options.time;
        const tickOpts = options.ticks;
        const timestamps = tickOpts.source === 'labels' ? this.getLabelTimestamps() : this._generate();
        if (options.bounds === 'ticks' && timestamps.length) {
          this.min = this._userMin || timestamps[0];
          this.max = this._userMax || timestamps[timestamps.length - 1];
        }
        const min = this.min;
        const max = this.max;
        const ticks = _filterBetween(timestamps, min, max);
        this._unit = timeOpts.unit || (tickOpts.autoSkip
          ? determineUnitForAutoTicks(timeOpts.minUnit, this.min, this.max, this._getLabelCapacity(min))
          : determineUnitForFormatting(this, ticks.length, timeOpts.minUnit, this.min, this.max));
        this._majorUnit = !tickOpts.major.enabled || this._unit === 'year' ? undefined
          : determineMajorUnit(this._unit);
        this.initOffsets(timestamps);
        if (options.reverse) {
          ticks.reverse();
        }
        return ticksFromTimestamps(this, ticks, this._majorUnit);
      }
      initOffsets(timestamps) {
        let start = 0;
        let end = 0;
        let first, last;
        if (this.options.offset && timestamps.length) {
          first = this.getDecimalForValue(timestamps[0]);
          if (timestamps.length === 1) {
            start = 1 - first;
          } else {
            start = (this.getDecimalForValue(timestamps[1]) - first) / 2;
          }
          last = this.getDecimalForValue(timestamps[timestamps.length - 1]);
          if (timestamps.length === 1) {
            end = last;
          } else {
            end = (last - this.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
          }
        }
        const limit = timestamps.length < 3 ? 0.5 : 0.25;
        start = _limitValue(start, 0, limit);
        end = _limitValue(end, 0, limit);
        this._offsets = {start, end, factor: 1 / (start + 1 + end)};
      }
      _generate() {
        const adapter = this._adapter;
        const min = this.min;
        const max = this.max;
        const options = this.options;
        const timeOpts = options.time;
        const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, this._getLabelCapacity(min));
        const stepSize = valueOrDefault(timeOpts.stepSize, 1);
        const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
        const hasWeekday = isNumber(weekday) || weekday === true;
        const ticks = {};
        let first = min;
        let time, count;
        if (hasWeekday) {
          first = +adapter.startOf(first, 'isoWeek', weekday);
        }
        first = +adapter.startOf(first, hasWeekday ? 'day' : minor);
        if (adapter.diff(max, min, minor) > 100000 * stepSize) {
          throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
        }
        const timestamps = options.ticks.source === 'data' && this.getDataTimestamps();
        for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
          addTick(ticks, time, timestamps);
        }
        if (time === max || options.bounds === 'ticks' || count === 1) {
          addTick(ticks, time, timestamps);
        }
        return Object.keys(ticks).sort((a, b) => a - b).map(x => +x);
      }
      getLabelForValue(value) {
        const adapter = this._adapter;
        const timeOpts = this.options.time;
        if (timeOpts.tooltipFormat) {
          return adapter.format(value, timeOpts.tooltipFormat);
        }
        return adapter.format(value, timeOpts.displayFormats.datetime);
      }
      _tickFormatFunction(time, index, ticks, format) {
        const options = this.options;
        const formats = options.time.displayFormats;
        const unit = this._unit;
        const majorUnit = this._majorUnit;
        const minorFormat = unit && formats[unit];
        const majorFormat = majorUnit && formats[majorUnit];
        const tick = ticks[index];
        const major = majorUnit && majorFormat && tick && tick.major;
        const label = this._adapter.format(time, format || (major ? majorFormat : minorFormat));
        const formatter = options.ticks.callback;
        return formatter ? callback(formatter, [label, index, ticks], this) : label;
      }
      generateTickLabels(ticks) {
        let i, ilen, tick;
        for (i = 0, ilen = ticks.length; i < ilen; ++i) {
          tick = ticks[i];
          tick.label = this._tickFormatFunction(tick.value, i, ticks);
        }
      }
      getDecimalForValue(value) {
        return value === null ? NaN : (value - this.min) / (this.max - this.min);
      }
      getPixelForValue(value) {
        const offsets = this._offsets;
        const pos = this.getDecimalForValue(value);
        return this.getPixelForDecimal((offsets.start + pos) * offsets.factor);
      }
      getValueForPixel(pixel) {
        const offsets = this._offsets;
        const pos = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return this.min + pos * (this.max - this.min);
      }
      _getLabelSize(label) {
        const ticksOpts = this.options.ticks;
        const tickLabelWidth = this.ctx.measureText(label).width;
        const angle = toRadians(this.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
        const cosRotation = Math.cos(angle);
        const sinRotation = Math.sin(angle);
        const tickFontSize = this._resolveTickFontOptions(0).size;
        return {
          w: (tickLabelWidth * cosRotation) + (tickFontSize * sinRotation),
          h: (tickLabelWidth * sinRotation) + (tickFontSize * cosRotation)
        };
      }
      _getLabelCapacity(exampleTime) {
        const timeOpts = this.options.time;
        const displayFormats = timeOpts.displayFormats;
        const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;
        const exampleLabel = this._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(this, [exampleTime], this._majorUnit), format);
        const size = this._getLabelSize(exampleLabel);
        const capacity = Math.floor(this.isHorizontal() ? this.width / size.w : this.height / size.h) - 1;
        return capacity > 0 ? capacity : 1;
      }
      getDataTimestamps() {
        let timestamps = this._cache.data || [];
        let i, ilen;
        if (timestamps.length) {
          return timestamps;
        }
        const metas = this.getMatchingVisibleMetas();
        if (this._normalized && metas.length) {
          return (this._cache.data = metas[0].controller.getAllParsedValues(this));
        }
        for (i = 0, ilen = metas.length; i < ilen; ++i) {
          timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(this));
        }
        return (this._cache.data = this.normalize(timestamps));
      }
      getLabelTimestamps() {
        const timestamps = this._cache.labels || [];
        let i, ilen;
        if (timestamps.length) {
          return timestamps;
        }
        const labels = this.getLabels();
        for (i = 0, ilen = labels.length; i < ilen; ++i) {
          timestamps.push(parse(this, labels[i]));
        }
        return (this._cache.labels = this._normalized ? timestamps : this.normalize(timestamps));
      }
      normalize(values) {
        return _arrayUnique(values.sort(sorter));
      }
    }
    TimeScale.id = 'time';
    TimeScale.defaults = {
      bounds: 'data',
      adapters: {},
      time: {
        parser: false,
        unit: false,
        round: false,
        isoWeekday: false,
        minUnit: 'millisecond',
        displayFormats: {}
      },
      ticks: {
        source: 'auto',
        major: {
          enabled: false
        }
      }
    };

    function interpolate(table, val, reverse) {
      let lo = 0;
      let hi = table.length - 1;
      let prevSource, nextSource, prevTarget, nextTarget;
      if (reverse) {
        if (val >= table[lo].pos && val <= table[hi].pos) {
          ({lo, hi} = _lookupByKey(table, 'pos', val));
        }
        ({pos: prevSource, time: prevTarget} = table[lo]);
        ({pos: nextSource, time: nextTarget} = table[hi]);
      } else {
        if (val >= table[lo].time && val <= table[hi].time) {
          ({lo, hi} = _lookupByKey(table, 'time', val));
        }
        ({time: prevSource, pos: prevTarget} = table[lo]);
        ({time: nextSource, pos: nextTarget} = table[hi]);
      }
      const span = nextSource - prevSource;
      return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
    }
    class TimeSeriesScale extends TimeScale {
      constructor(props) {
        super(props);
        this._table = [];
        this._minPos = undefined;
        this._tableRange = undefined;
      }
      initOffsets() {
        const timestamps = this._getTimestampsForTable();
        const table = this._table = this.buildLookupTable(timestamps);
        this._minPos = interpolate(table, this.min);
        this._tableRange = interpolate(table, this.max) - this._minPos;
        super.initOffsets(timestamps);
      }
      buildLookupTable(timestamps) {
        const {min, max} = this;
        const items = [];
        const table = [];
        let i, ilen, prev, curr, next;
        for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
          curr = timestamps[i];
          if (curr >= min && curr <= max) {
            items.push(curr);
          }
        }
        if (items.length < 2) {
          return [
            {time: min, pos: 0},
            {time: max, pos: 1}
          ];
        }
        for (i = 0, ilen = items.length; i < ilen; ++i) {
          next = items[i + 1];
          prev = items[i - 1];
          curr = items[i];
          if (Math.round((next + prev) / 2) !== curr) {
            table.push({time: curr, pos: i / (ilen - 1)});
          }
        }
        return table;
      }
      _getTimestampsForTable() {
        let timestamps = this._cache.all || [];
        if (timestamps.length) {
          return timestamps;
        }
        const data = this.getDataTimestamps();
        const label = this.getLabelTimestamps();
        if (data.length && label.length) {
          timestamps = this.normalize(data.concat(label));
        } else {
          timestamps = data.length ? data : label;
        }
        timestamps = this._cache.all = timestamps;
        return timestamps;
      }
      getDecimalForValue(value) {
        return (interpolate(this._table, value) - this._minPos) / this._tableRange;
      }
      getValueForPixel(pixel) {
        const offsets = this._offsets;
        const decimal = this.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
        return interpolate(this._table, decimal * this._tableRange + this._minPos, true);
      }
    }
    TimeSeriesScale.id = 'timeseries';
    TimeSeriesScale.defaults = TimeScale.defaults;

    /* src\components\Chart.svelte generated by Svelte v3.47.0 */
    const file$6 = "src\\components\\Chart.svelte";

    function create_fragment$9(ctx) {
    	let canvas;

    	const block = {
    		c: function create() {
    			canvas = element("canvas");
    			attr_dev(canvas, "id", "myChart");
    			attr_dev(canvas, "width", "100");
    			attr_dev(canvas, "height", "100");
    			add_location(canvas, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas, anchor);
    			/*canvas_binding*/ ctx[1](canvas);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas);
    			/*canvas_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $studentData;
    	validate_store(studentData, 'studentData');
    	component_subscribe($$self, studentData, $$value => $$invalidate(2, $studentData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart', slots, []);
    	Chart.register(ArcElement, LineElement, BarElement, PointElement, BarController, BubbleController, DoughnutController, LineController, PieController, PolarAreaController, RadarController, ScatterController, CategoryScale, LinearScale, LogarithmicScale, RadialLinearScale, TimeScale, TimeSeriesScale, plugin_decimation, plugin_filler, plugin_legend, plugin_title, plugin_tooltip, plugin_subtitle);
    	let ctx;

    	const data = {
    		labels: ['Fravær', 'Samlede antal Lektioner'],
    		datasets: [
    			{
    				label: 'Fraværs procent',
    				data: [$studentData.absenceLessons, $studentData.totalLessons],
    				backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
    				hoverOffset: 4
    			}
    		]
    	};

    	onMount(async () => {
    		new Chart(ctx, { type: "doughnut", data });
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chart> was created with unknown prop '${key}'`);
    	});

    	function canvas_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			ctx = $$value;
    			$$invalidate(0, ctx);
    		});
    	}

    	$$self.$capture_state = () => ({
    		Chart,
    		ArcElement,
    		LineElement,
    		BarElement,
    		PointElement,
    		BarController,
    		BubbleController,
    		DoughnutController,
    		LineController,
    		PieController,
    		PolarAreaController,
    		RadarController,
    		ScatterController,
    		CategoryScale,
    		LinearScale,
    		LogarithmicScale,
    		RadialLinearScale,
    		TimeScale,
    		TimeSeriesScale,
    		Decimation: plugin_decimation,
    		Filler: plugin_filler,
    		Legend: plugin_legend,
    		Title: plugin_title,
    		Tooltip: plugin_tooltip,
    		SubTitle: plugin_subtitle,
    		onMount,
    		studentData,
    		ctx,
    		data,
    		$studentData
    	});

    	$$self.$inject_state = $$props => {
    		if ('ctx' in $$props) $$invalidate(0, ctx = $$props.ctx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ctx, canvas_binding];
    }

    class Chart_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_1",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\pages\Absence\Absence.svelte generated by Svelte v3.47.0 */
    const file$5 = "src\\pages\\Absence\\Absence.svelte";

    function create_fragment$8(ctx) {
    	let div1;
    	let div0;
    	let chart;
    	let current;
    	chart = new Chart_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(chart.$$.fragment);
    			attr_dev(div0, "class", "chart-conatiner svelte-1wmapp8");
    			add_location(div0, file$5, 6, 2, 106);
    			attr_dev(div1, "class", "container svelte-1wmapp8");
    			add_location(div1, file$5, 5, 0, 79);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(chart, div0, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(chart);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Absence', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Absence> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Chart: Chart_1 });
    	return [];
    }

    class Absence extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Absence",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\NavBar.svelte generated by Svelte v3.47.0 */
    const file$4 = "src\\components\\NavBar.svelte";

    // (8:4) <Link to="/" class="svelte-link logo-link">
    function create_default_slot_5$1(ctx) {
    	let svg;
    	let path;
    	let t0;
    	let p;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			p = element("p");
    			p.textContent = "PrettyIntra";
    			attr_dev(path, "fill", "#fff");
    			attr_dev(path, "d", "M318 123.645l-61.5 35.7-61.76-35.7 61.76-35.7zm93.68 54.19l-61.76 35.7 61.76 35.7 61.5-35.7zm-294.39 80.64l61.76 35.7 61.5-35.7-61.5-35.7zm139.52-80.57l-61.76 35.7 61.76 35.7 61.5-35.7zM31 298.365l62 35.69v-71l-62-35.65v71zm373-26l-62 35.69v70.94l62-35.66v-70.97zm-225.11-139.4l-61.76 35.7 61.76 35.7 61.5-35.7zM109 343.305l62 35.69v-70.94l-62-35.69v71zm225.41-120.45l-61.76 35.7 61.76 35.7 61.5-35.7zM249 353.055l-62-35.7v71l62 35.7v-71zm77-35.67l-61 35.67v70.94l61-35.66v-70.95zm8.07-184.5l-61.76 35.7 61.76 35.7 61.5-35.7zm-232.6 44.95l-61.77 35.7 61.76 35.7 61.5-35.7zM481 227.565l-61 35.66v70.94l61-35.66v-70.94zm-286.11 75.93l61.76 35.7 61.5-35.7-61.5-35.7z");
    			attr_dev(path, "class", "cls-1");
    			add_location(path, file$4, 8, 95, 244);
    			attr_dev(svg, "height", "50px");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "viewBox", "0 0 512 512");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$4, 8, 6, 155);
    			attr_dev(p, "class", "brand-name svelte-mns28g");
    			add_location(p, file$4, 9, 6, 959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(8:4) <Link to=\\\"/\\\" class=\\\"svelte-link logo-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:6) <Link to="/" class="svelte-link">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Forside");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(15:6) <Link to=\\\"/\\\" class=\\\"svelte-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:6) <Link to="/schedule" class="svelte-link">
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Skema");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(18:6) <Link to=\\\"/schedule\\\" class=\\\"svelte-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:6) <Link to="/students" class="svelte-link">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Elever");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(21:6) <Link to=\\\"/students\\\" class=\\\"svelte-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:6) <Link to="/absence" class="svelte-link">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Fravær");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(24:6) <Link to=\\\"/absence\\\" class=\\\"svelte-link\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:6) <Link to="/logout" class="svelte-link">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Log ud");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(27:6) <Link to=\\\"/logout\\\" class=\\\"svelte-link\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let nav;
    	let div;
    	let link0;
    	let t0;
    	let ul;
    	let li0;
    	let link1;
    	let t1;
    	let li1;
    	let link2;
    	let t2;
    	let li2;
    	let link3;
    	let t3;
    	let li3;
    	let link4;
    	let t4;
    	let li4;
    	let link5;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				class: "svelte-link logo-link",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/",
    				class: "svelte-link",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/schedule",
    				class: "svelte-link",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/students",
    				class: "svelte-link",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/absence",
    				class: "svelte-link",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: "/logout",
    				class: "svelte-link",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			li1 = element("li");
    			create_component(link2.$$.fragment);
    			t2 = space();
    			li2 = element("li");
    			create_component(link3.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			create_component(link4.$$.fragment);
    			t4 = space();
    			li4 = element("li");
    			create_component(link5.$$.fragment);
    			attr_dev(div, "class", "logo svelte-mns28g");
    			add_location(div, file$4, 6, 2, 80);
    			attr_dev(li0, "class", "nav-item svelte-mns28g");
    			add_location(li0, file$4, 13, 4, 1051);
    			attr_dev(li1, "class", "nav-item svelte-mns28g");
    			add_location(li1, file$4, 16, 4, 1144);
    			attr_dev(li2, "class", "nav-item svelte-mns28g");
    			add_location(li2, file$4, 19, 4, 1243);
    			attr_dev(li3, "class", "nav-item svelte-mns28g");
    			add_location(li3, file$4, 22, 4, 1343);
    			attr_dev(li4, "class", "nav-item svelte-mns28g");
    			add_location(li4, file$4, 25, 4, 1442);
    			attr_dev(ul, "class", "nav-links svelte-mns28g");
    			add_location(ul, file$4, 12, 2, 1023);
    			attr_dev(nav, "class", "svelte-mns28g");
    			add_location(nav, file$4, 4, 0, 67);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div);
    			mount_component(link0, div, null);
    			append_dev(nav, t0);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			mount_component(link1, li0, null);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			mount_component(link2, li1, null);
    			append_dev(ul, t2);
    			append_dev(ul, li2);
    			mount_component(link3, li2, null);
    			append_dev(ul, t3);
    			append_dev(ul, li3);
    			mount_component(link4, li3, null);
    			append_dev(ul, t4);
    			append_dev(ul, li4);
    			mount_component(link5, li4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link: Link$1 });
    	return [];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\PrivateRouteGuard.svelte generated by Svelte v3.47.0 */

    // (16:2) {#if $isLoggedIn}
    function create_if_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(16:2) {#if $isLoggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$isLoggedIn*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$isLoggedIn*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$isLoggedIn*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $location;
    	let $isLoggedIn;
    	validate_store(isLoggedIn, 'isLoggedIn');
    	component_subscribe($$self, isLoggedIn, $$value => $$invalidate(0, $isLoggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrivateRouteGuard', slots, ['default']);
    	const navigate = useNavigate();
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivateRouteGuard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		useNavigate,
    		useLocation,
    		isLoggedIn,
    		navigate,
    		location,
    		$location,
    		$isLoggedIn
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$isLoggedIn, $location*/ 5) {
    			if ($isLoggedIn === false) {
    				navigate("/login", {
    					state: { from: $location.pathname },
    					replace: true
    				});
    			}
    		}
    	};

    	return [$isLoggedIn, location, $location, $$scope, slots];
    }

    class PrivateRouteGuard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivateRouteGuard",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\PrivateRoute.svelte generated by Svelte v3.47.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*params*/ 8,
    	location: dirty & /*location*/ 16,
    	navigate: dirty & /*navigate*/ 32
    });

    const get_default_slot_context = ctx => ({
    	params: /*params*/ ctx[3],
    	location: /*location*/ ctx[4],
    	navigate: /*navigate*/ ctx[5]
    });

    // (9:1) <PrivateRouteGuard>
    function create_default_slot_1$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, params, location, navigate*/ 60)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(9:1) <PrivateRouteGuard>",
    		ctx
    	});

    	return block;
    }

    // (8:0) <Route {path} primary={false} let:params let:location let:navigate>
    function create_default_slot$1(ctx) {
    	let privaterouteguard;
    	let current;

    	privaterouteguard = new PrivateRouteGuard({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(privaterouteguard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(privaterouteguard, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const privaterouteguard_changes = {};

    			if (dirty & /*$$scope, params, location, navigate*/ 60) {
    				privaterouteguard_changes.$$scope = { dirty, ctx };
    			}

    			privaterouteguard.$set(privaterouteguard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(privaterouteguard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(privaterouteguard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(privaterouteguard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(8:0) <Route {path} primary={false} let:params let:location let:navigate>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let route;
    	let current;

    	route = new Route$1({
    			props: {
    				path: /*path*/ ctx[0],
    				primary: false,
    				$$slots: {
    					default: [
    						create_default_slot$1,
    						({ params, location, navigate }) => ({ 3: params, 4: location, 5: navigate }),
    						({ params, location, navigate }) => (params ? 8 : 0) | (location ? 16 : 0) | (navigate ? 32 : 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const route_changes = {};
    			if (dirty & /*path*/ 1) route_changes.path = /*path*/ ctx[0];

    			if (dirty & /*$$scope, params, location, navigate*/ 60) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PrivateRoute', slots, ['default']);
    	let { path } = $$props;
    	const writable_props = ['path'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PrivateRoute> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ Route: Route$1, PrivateRouteGuard, path });

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(0, path = $$props.path);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [path, slots, $$scope];
    }

    class PrivateRoute extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { path: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PrivateRoute",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*path*/ ctx[0] === undefined && !('path' in props)) {
    			console.warn("<PrivateRoute> was created without expected prop 'path'");
    		}
    	}

    	get path() {
    		throw new Error("<PrivateRoute>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<PrivateRoute>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Logout.svelte generated by Svelte v3.47.0 */

    // (20:2) {#if $isLoggedIn}
    function create_if_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:2) {#if $isLoggedIn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$isLoggedIn*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$isLoggedIn*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$isLoggedIn*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $location;
    	let $isLoggedIn;
    	validate_store(isLoggedIn, 'isLoggedIn');
    	component_subscribe($$self, isLoggedIn, $$value => $$invalidate(0, $isLoggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logout', slots, ['default']);
    	const navigate = useNavigate();
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	isLoggedIn.set(false);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logout> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		useNavigate,
    		useLocation,
    		isLoggedIn,
    		toasts,
    		navigate,
    		location,
    		$location,
    		$isLoggedIn
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$isLoggedIn, $location*/ 5) {
    			if ($isLoggedIn === false) {
    				toasts.info("Du er nu logget ud");

    				navigate("/login", {
    					state: { from: $location.pathname },
    					replace: true
    				});
    			}
    		}
    	};

    	return [$isLoggedIn, location, $location, $$scope, slots];
    }

    class Logout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logout",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Lesson.svelte generated by Svelte v3.47.0 */

    const file$3 = "src\\components\\Lesson.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let p;
    	let t;
    	let div_style_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t = text(/*subject*/ ctx[0]);
    			add_location(p, file$3, 24, 4, 502);
    			attr_dev(div, "id", "subject-container");
    			attr_dev(div, "style", div_style_value = `background-color: ${/*color*/ ctx[1]};`);
    			attr_dev(div, "class", "subject-container svelte-5nt0vf");
    			add_location(div, file$3, 23, 0, 404);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*subject*/ 1) set_data_dev(t, /*subject*/ ctx[0]);

    			if (dirty & /*color*/ 2 && div_style_value !== (div_style_value = `background-color: ${/*color*/ ctx[1]};`)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Lesson', slots, []);
    	let { subject } = $$props;
    	let color;

    	if (subject === "Dansk") {
    		color = "#46B1C9";
    	} else if (subject == "Engelsk") {
    		color = "#84c0c6";
    	} else if (subject == "Historie") {
    		color = "#9fb7b9";
    	} else if (subject == "Matematik") {
    		color = "#bcc1ba";
    	} else if (subject == "Geografi") {
    		color = "#F2E2D2";
    	}

    	const writable_props = ['subject'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Lesson> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('subject' in $$props) $$invalidate(0, subject = $$props.subject);
    	};

    	$$self.$capture_state = () => ({ subject, color });

    	$$self.$inject_state = $$props => {
    		if ('subject' in $$props) $$invalidate(0, subject = $$props.subject);
    		if ('color' in $$props) $$invalidate(1, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [subject, color];
    }

    class Lesson extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { subject: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lesson",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*subject*/ ctx[0] === undefined && !('subject' in props)) {
    			console.warn("<Lesson> was created without expected prop 'subject'");
    		}
    	}

    	get subject() {
    		throw new Error("<Lesson>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subject(value) {
    		throw new Error("<Lesson>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Calendar.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$2 = "src\\components\\Calendar.svelte";

    function create_fragment$2(ctx) {
    	let div34;
    	let div32;
    	let div6;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let br0;
    	let t3;
    	let t4_value = /*week*/ ctx[0].monday + "";
    	let t4;
    	let t5;
    	let div2;
    	let t6;
    	let br1;
    	let t7;
    	let t8_value = /*week*/ ctx[0].tuesday + "";
    	let t8;
    	let t9;
    	let div3;
    	let t10;
    	let br2;
    	let t11;
    	let t12_value = /*week*/ ctx[0].wednesday + "";
    	let t12;
    	let t13;
    	let div4;
    	let t14;
    	let br3;
    	let t15;
    	let t16_value = /*week*/ ctx[0].thursday + "";
    	let t16;
    	let t17;
    	let div5;
    	let t18;
    	let br4;
    	let t19;
    	let t20_value = /*week*/ ctx[0].friday + "";
    	let t20;
    	let t21;
    	let div31;
    	let div7;
    	let t23;
    	let div8;
    	let t25;
    	let div9;
    	let t27;
    	let div10;
    	let t29;
    	let div11;
    	let t30;
    	let div12;
    	let t31;
    	let div13;
    	let t32;
    	let div14;
    	let t33;
    	let div15;
    	let t34;
    	let div16;
    	let t35;
    	let div17;
    	let t36;
    	let div18;
    	let t37;
    	let div19;
    	let t38;
    	let div20;
    	let t39;
    	let div21;
    	let t40;
    	let div22;
    	let t41;
    	let div23;
    	let t42;
    	let div24;
    	let t43;
    	let div25;
    	let t44;
    	let div26;
    	let t45;
    	let div27;
    	let t46;
    	let div28;
    	let t47;
    	let div29;
    	let t48;
    	let div30;
    	let t49;
    	let div33;
    	let button0;
    	let t51;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div34 = element("div");
    			div32 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			div0.textContent = "Tidspunkt";
    			t1 = space();
    			div1 = element("div");
    			t2 = text("Mandag ");
    			br0 = element("br");
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			t6 = text("Tirsdag ");
    			br1 = element("br");
    			t7 = space();
    			t8 = text(t8_value);
    			t9 = space();
    			div3 = element("div");
    			t10 = text("Onsdag ");
    			br2 = element("br");
    			t11 = space();
    			t12 = text(t12_value);
    			t13 = space();
    			div4 = element("div");
    			t14 = text("Torsdag ");
    			br3 = element("br");
    			t15 = space();
    			t16 = text(t16_value);
    			t17 = space();
    			div5 = element("div");
    			t18 = text("Fredag ");
    			br4 = element("br");
    			t19 = space();
    			t20 = text(t20_value);
    			t21 = space();
    			div31 = element("div");
    			div7 = element("div");
    			div7.textContent = "08:30 - 10:00";
    			t23 = space();
    			div8 = element("div");
    			div8.textContent = "10:15 - 11:45";
    			t25 = space();
    			div9 = element("div");
    			div9.textContent = "12:30 - 14:00";
    			t27 = space();
    			div10 = element("div");
    			div10.textContent = "14:15 - 15:45";
    			t29 = space();
    			div11 = element("div");
    			t30 = space();
    			div12 = element("div");
    			t31 = space();
    			div13 = element("div");
    			t32 = space();
    			div14 = element("div");
    			t33 = space();
    			div15 = element("div");
    			t34 = space();
    			div16 = element("div");
    			t35 = space();
    			div17 = element("div");
    			t36 = space();
    			div18 = element("div");
    			t37 = space();
    			div19 = element("div");
    			t38 = space();
    			div20 = element("div");
    			t39 = space();
    			div21 = element("div");
    			t40 = space();
    			div22 = element("div");
    			t41 = space();
    			div23 = element("div");
    			t42 = space();
    			div24 = element("div");
    			t43 = space();
    			div25 = element("div");
    			t44 = space();
    			div26 = element("div");
    			t45 = space();
    			div27 = element("div");
    			t46 = space();
    			div28 = element("div");
    			t47 = space();
    			div29 = element("div");
    			t48 = space();
    			div30 = element("div");
    			t49 = space();
    			div33 = element("div");
    			button0 = element("button");
    			button0.textContent = "←";
    			t51 = space();
    			button1 = element("button");
    			button1.textContent = "→";
    			attr_dev(div0, "class", "time-row top-left-corner svelte-1us6wt7");
    			add_location(div0, file$2, 93, 6, 2990);
    			add_location(br0, file$2, 94, 18, 3063);
    			attr_dev(div1, "class", "svelte-1us6wt7");
    			add_location(div1, file$2, 94, 6, 3051);
    			add_location(br1, file$2, 95, 19, 3110);
    			attr_dev(div2, "class", "svelte-1us6wt7");
    			add_location(div2, file$2, 95, 6, 3097);
    			add_location(br2, file$2, 96, 18, 3157);
    			attr_dev(div3, "class", "svelte-1us6wt7");
    			add_location(div3, file$2, 96, 6, 3145);
    			add_location(br3, file$2, 97, 19, 3207);
    			attr_dev(div4, "class", "svelte-1us6wt7");
    			add_location(div4, file$2, 97, 6, 3194);
    			add_location(br4, file$2, 98, 43, 3280);
    			attr_dev(div5, "class", "top-right-corner svelte-1us6wt7");
    			add_location(div5, file$2, 98, 6, 3243);
    			attr_dev(div6, "class", "rows svelte-1us6wt7");
    			add_location(div6, file$2, 92, 4, 2964);
    			attr_dev(div7, "class", "time svelte-1us6wt7");
    			add_location(div7, file$2, 102, 6, 3352);
    			attr_dev(div8, "class", "time svelte-1us6wt7");
    			add_location(div8, file$2, 103, 6, 3397);
    			attr_dev(div9, "class", "time svelte-1us6wt7");
    			add_location(div9, file$2, 104, 6, 3442);
    			attr_dev(div10, "class", "time bottom-left-corner svelte-1us6wt7");
    			add_location(div10, file$2, 105, 6, 3487);
    			attr_dev(div11, "class", "col-item svelte-1us6wt7");
    			attr_dev(div11, "data-value", "1");
    			add_location(div11, file$2, 107, 6, 3553);
    			attr_dev(div12, "class", "col-item svelte-1us6wt7");
    			attr_dev(div12, "data-value", "2");
    			add_location(div12, file$2, 108, 6, 3600);
    			attr_dev(div13, "class", "col-item svelte-1us6wt7");
    			attr_dev(div13, "data-value", "3");
    			add_location(div13, file$2, 109, 6, 3647);
    			attr_dev(div14, "class", "col-item svelte-1us6wt7");
    			attr_dev(div14, "data-value", "4");
    			add_location(div14, file$2, 110, 6, 3694);
    			attr_dev(div15, "class", "col-item svelte-1us6wt7");
    			attr_dev(div15, "data-value", "1");
    			add_location(div15, file$2, 112, 6, 3743);
    			attr_dev(div16, "class", "col-item svelte-1us6wt7");
    			attr_dev(div16, "data-value", "2");
    			add_location(div16, file$2, 113, 6, 3790);
    			attr_dev(div17, "class", "col-item svelte-1us6wt7");
    			attr_dev(div17, "data-value", "3");
    			add_location(div17, file$2, 114, 6, 3837);
    			attr_dev(div18, "class", "col-item svelte-1us6wt7");
    			attr_dev(div18, "data-value", "4");
    			add_location(div18, file$2, 115, 6, 3884);
    			attr_dev(div19, "class", "col-item svelte-1us6wt7");
    			attr_dev(div19, "data-value", "1");
    			add_location(div19, file$2, 117, 6, 3933);
    			attr_dev(div20, "class", "col-item svelte-1us6wt7");
    			attr_dev(div20, "data-value", "2");
    			add_location(div20, file$2, 118, 6, 3980);
    			attr_dev(div21, "class", "col-item svelte-1us6wt7");
    			attr_dev(div21, "data-value", "3");
    			add_location(div21, file$2, 119, 6, 4027);
    			attr_dev(div22, "class", "col-item svelte-1us6wt7");
    			attr_dev(div22, "data-value", "4");
    			add_location(div22, file$2, 120, 6, 4074);
    			attr_dev(div23, "class", "col-item svelte-1us6wt7");
    			attr_dev(div23, "data-value", "1");
    			add_location(div23, file$2, 122, 6, 4123);
    			attr_dev(div24, "class", "col-item svelte-1us6wt7");
    			attr_dev(div24, "data-value", "2");
    			add_location(div24, file$2, 123, 6, 4170);
    			attr_dev(div25, "class", "col-item svelte-1us6wt7");
    			attr_dev(div25, "data-value", "3");
    			add_location(div25, file$2, 124, 6, 4217);
    			attr_dev(div26, "class", "col-item svelte-1us6wt7");
    			attr_dev(div26, "data-value", "4");
    			add_location(div26, file$2, 125, 6, 4264);
    			attr_dev(div27, "class", "col-item svelte-1us6wt7");
    			attr_dev(div27, "data-value", "1");
    			add_location(div27, file$2, 127, 6, 4313);
    			attr_dev(div28, "class", "col-item svelte-1us6wt7");
    			attr_dev(div28, "data-value", "2");
    			add_location(div28, file$2, 128, 6, 4360);
    			attr_dev(div29, "class", "col-item svelte-1us6wt7");
    			attr_dev(div29, "data-value", "3");
    			add_location(div29, file$2, 129, 6, 4407);
    			attr_dev(div30, "class", "col-item bottom-right-corner svelte-1us6wt7");
    			attr_dev(div30, "data-value", "4");
    			add_location(div30, file$2, 130, 6, 4454);
    			attr_dev(div31, "class", "cols svelte-1us6wt7");
    			add_location(div31, file$2, 101, 4, 3326);
    			attr_dev(div32, "class", "calendar svelte-1us6wt7");
    			add_location(div32, file$2, 91, 2, 2936);
    			attr_dev(button0, "id", "left-btn");
    			attr_dev(button0, "class", "btn svelte-1us6wt7");
    			add_location(button0, file$2, 134, 4, 4566);
    			attr_dev(button1, "id", "right-btn");
    			attr_dev(button1, "class", "btn svelte-1us6wt7");
    			add_location(button1, file$2, 137, 4, 4664);
    			attr_dev(div33, "class", "buttons");
    			add_location(div33, file$2, 133, 2, 4539);
    			attr_dev(div34, "class", "calendar-container svelte-1us6wt7");
    			add_location(div34, file$2, 90, 0, 2900);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div34, anchor);
    			append_dev(div34, div32);
    			append_dev(div32, div6);
    			append_dev(div6, div0);
    			append_dev(div6, t1);
    			append_dev(div6, div1);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			append_dev(div1, t4);
    			append_dev(div6, t5);
    			append_dev(div6, div2);
    			append_dev(div2, t6);
    			append_dev(div2, br1);
    			append_dev(div2, t7);
    			append_dev(div2, t8);
    			append_dev(div6, t9);
    			append_dev(div6, div3);
    			append_dev(div3, t10);
    			append_dev(div3, br2);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div6, t13);
    			append_dev(div6, div4);
    			append_dev(div4, t14);
    			append_dev(div4, br3);
    			append_dev(div4, t15);
    			append_dev(div4, t16);
    			append_dev(div6, t17);
    			append_dev(div6, div5);
    			append_dev(div5, t18);
    			append_dev(div5, br4);
    			append_dev(div5, t19);
    			append_dev(div5, t20);
    			append_dev(div32, t21);
    			append_dev(div32, div31);
    			append_dev(div31, div7);
    			append_dev(div31, t23);
    			append_dev(div31, div8);
    			append_dev(div31, t25);
    			append_dev(div31, div9);
    			append_dev(div31, t27);
    			append_dev(div31, div10);
    			append_dev(div31, t29);
    			append_dev(div31, div11);
    			append_dev(div31, t30);
    			append_dev(div31, div12);
    			append_dev(div31, t31);
    			append_dev(div31, div13);
    			append_dev(div31, t32);
    			append_dev(div31, div14);
    			append_dev(div31, t33);
    			append_dev(div31, div15);
    			append_dev(div31, t34);
    			append_dev(div31, div16);
    			append_dev(div31, t35);
    			append_dev(div31, div17);
    			append_dev(div31, t36);
    			append_dev(div31, div18);
    			append_dev(div31, t37);
    			append_dev(div31, div19);
    			append_dev(div31, t38);
    			append_dev(div31, div20);
    			append_dev(div31, t39);
    			append_dev(div31, div21);
    			append_dev(div31, t40);
    			append_dev(div31, div22);
    			append_dev(div31, t41);
    			append_dev(div31, div23);
    			append_dev(div31, t42);
    			append_dev(div31, div24);
    			append_dev(div31, t43);
    			append_dev(div31, div25);
    			append_dev(div31, t44);
    			append_dev(div31, div26);
    			append_dev(div31, t45);
    			append_dev(div31, div27);
    			append_dev(div31, t46);
    			append_dev(div31, div28);
    			append_dev(div31, t47);
    			append_dev(div31, div29);
    			append_dev(div31, t48);
    			append_dev(div31, div30);
    			append_dev(div34, t49);
    			append_dev(div34, div33);
    			append_dev(div33, button0);
    			append_dev(div33, t51);
    			append_dev(div33, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*handleCalendarBack*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*handleCalendarForward*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*week*/ 1 && t4_value !== (t4_value = /*week*/ ctx[0].monday + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*week*/ 1 && t8_value !== (t8_value = /*week*/ ctx[0].tuesday + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*week*/ 1 && t12_value !== (t12_value = /*week*/ ctx[0].wednesday + "")) set_data_dev(t12, t12_value);
    			if (dirty & /*week*/ 1 && t16_value !== (t16_value = /*week*/ ctx[0].thursday + "")) set_data_dev(t16, t16_value);
    			if (dirty & /*week*/ 1 && t20_value !== (t20_value = /*week*/ ctx[0].friday + "")) set_data_dev(t20, t20_value);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div34);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $studentData;
    	validate_store(studentData, 'studentData');
    	component_subscribe($$self, studentData, $$value => $$invalidate(3, $studentData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);

    	let week = {
    		monday: moment().startOf("week").add("days", 1).format("YYYY-MM-DD"),
    		tuesday: moment().startOf("week").add("days", 2).format("YYYY-MM-DD"),
    		wednesday: moment().startOf("week").add("days", 3).format("YYYY-MM-DD"),
    		thursday: moment().startOf("week").add("days", 4).format("YYYY-MM-DD"),
    		friday: moment().startOf("week").add("days", 5).format("YYYY-MM-DD")
    	};

    	async function getLessons() {
    		const resp = await fetch(`http://localhost:3000/api/lessons/${$studentData.classId}/${week.monday}/${week.friday}`);
    		const respData = await resp.json();
    		return respData.data;
    	}

    	onMount(async () => {
    		const lessons = await getLessons();
    		updateCalendar(lessons);
    	});

    	async function handleCalendarBack() {
    		$$invalidate(0, week = {
    			monday: moment(week.monday).subtract(7, "days").format("YYYY-MM-DD"),
    			tuesday: moment(week.tuesday).subtract(7, "days").format("YYYY-MM-DD"),
    			wednesday: moment(week.wednesday).subtract(7, "days").format("YYYY-MM-DD"),
    			thursday: moment(week.thursday).subtract(7, "days").format("YYYY-MM-DD"),
    			friday: moment(week.friday).subtract(7, "days").format("YYYY-MM-DD")
    		});

    		//get lessons for each day
    		const lessons = await getLessons();

    		//update the calendar on the page
    		updateCalendar(lessons);
    	}

    	async function handleCalendarForward() {
    		$$invalidate(0, week = {
    			monday: moment(week.monday).add(7, "days").format("YYYY-MM-DD"),
    			tuesday: moment(week.tuesday).add(7, "days").format("YYYY-MM-DD"),
    			wednesday: moment(week.wednesday).add(7, "days").format("YYYY-MM-DD"),
    			thursday: moment(week.thursday).add(7, "days").format("YYYY-MM-DD"),
    			friday: moment(week.friday).add(7, "days").format("YYYY-MM-DD")
    		});

    		//get lessons for each day
    		const lessons = await getLessons();

    		//update the calendar on the page
    		updateCalendar(lessons);
    	}

    	function updateCalendar(lessons) {
    		console.log(lessons);
    		const cols = document.querySelectorAll(".col-item");

    		//clear the calendar
    		cols.forEach(col => {
    			col.innerHTML = "";
    		});

    		let currentColDay = 0;

    		lessons.forEach((lesson, i) => {
    			const day = moment(lesson.lessonDate).day();

    			cols.forEach((col, j) => {
    				if (j % 4 === 0) ++currentColDay;

    				if (currentColDay === day) {
    					if (Number(col.dataset.value) === lesson.lessonNumber) {
    						new Lesson({
    								target: col,
    								props: { subject: lesson.lessonSubject }
    							});
    					}
    				}
    			});

    			currentColDay = 0;
    		});
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		studentData,
    		Lesson,
    		moment,
    		onMount,
    		week,
    		getLessons,
    		handleCalendarBack,
    		handleCalendarForward,
    		updateCalendar,
    		$studentData
    	});

    	$$self.$inject_state = $$props => {
    		if ('week' in $$props) $$invalidate(0, week = $$props.week);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [week, handleCalendarBack, handleCalendarForward];
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\pages\Schedule\Schedule.svelte generated by Svelte v3.47.0 */
    const file$1 = "src\\pages\\Schedule\\Schedule.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let calendar;
    	let current;
    	calendar = new Calendar({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(calendar.$$.fragment);
    			attr_dev(div, "class", "container svelte-v9tkhf");
    			add_location(div, file$1, 4, 0, 81);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(calendar, div, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(calendar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Schedule', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Schedule> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Calendar });
    	return [];
    }

    class Schedule extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Schedule",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    // (17:2) {#if $isLoggedIn}
    function create_if_block(ctx) {
    	let navbar;
    	let current;
    	navbar = new NavBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(17:2) {#if $isLoggedIn}",
    		ctx
    	});

    	return block;
    }

    // (23:6) <PrivateRoute path="/" let:location>
    function create_default_slot_7(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(23:6) <PrivateRoute path=\\\"/\\\" let:location>",
    		ctx
    	});

    	return block;
    }

    // (27:6) <PrivateRoute path="/students" let:location>
    function create_default_slot_6(ctx) {
    	let students;
    	let current;
    	students = new Students({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(students.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(students, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(students.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(students.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(students, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(27:6) <PrivateRoute path=\\\"/students\\\" let:location>",
    		ctx
    	});

    	return block;
    }

    // (31:6) <PrivateRoute path="/absence" let:location>
    function create_default_slot_5(ctx) {
    	let absence;
    	let current;
    	absence = new Absence({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(absence.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(absence, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(absence.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(absence.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(absence, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(31:6) <PrivateRoute path=\\\"/absence\\\" let:location>",
    		ctx
    	});

    	return block;
    }

    // (35:6) <PrivateRoute path="/schedule" let:location>
    function create_default_slot_4(ctx) {
    	let schedule;
    	let current;
    	schedule = new Schedule({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(schedule.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(schedule, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(schedule.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(schedule.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(schedule, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(35:6) <PrivateRoute path=\\\"/schedule\\\" let:location>",
    		ctx
    	});

    	return block;
    }

    // (39:6) <Route path="/login">
    function create_default_slot_3(ctx) {
    	let login;
    	let current;
    	login = new Login({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(login.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(login, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(login.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(login.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(login, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(39:6) <Route path=\\\"/login\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:6) <Route path="/logout">
    function create_default_slot_2(ctx) {
    	let logout;
    	let current;
    	logout = new Logout({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(logout.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(logout, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(43:6) <Route path=\\\"/logout\\\">",
    		ctx
    	});

    	return block;
    }

    // (47:6) <ToastContainer placement="bottom-right" let:data>
    function create_default_slot_1(ctx) {
    	let flattoast;
    	let current;

    	flattoast = new FlatToast({
    			props: { data: /*data*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(flattoast.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flattoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flattoast_changes = {};
    			if (dirty & /*data*/ 2) flattoast_changes.data = /*data*/ ctx[1];
    			flattoast.$set(flattoast_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flattoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flattoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flattoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(47:6) <ToastContainer placement=\\\"bottom-right\\\" let:data>",
    		ctx
    	});

    	return block;
    }

    // (15:0) <Router>
    function create_default_slot(ctx) {
    	let t0;
    	let main;
    	let div;
    	let privateroute0;
    	let t1;
    	let privateroute1;
    	let t2;
    	let privateroute2;
    	let t3;
    	let privateroute3;
    	let t4;
    	let route0;
    	let t5;
    	let route1;
    	let t6;
    	let toastcontainer;
    	let current;
    	let if_block = /*$isLoggedIn*/ ctx[0] && create_if_block(ctx);

    	privateroute0 = new PrivateRoute({
    			props: {
    				path: "/",
    				$$slots: {
    					default: [
    						create_default_slot_7,
    						({ location }) => ({ 2: location }),
    						({ location }) => location ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	privateroute1 = new PrivateRoute({
    			props: {
    				path: "/students",
    				$$slots: {
    					default: [
    						create_default_slot_6,
    						({ location }) => ({ 2: location }),
    						({ location }) => location ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	privateroute2 = new PrivateRoute({
    			props: {
    				path: "/absence",
    				$$slots: {
    					default: [
    						create_default_slot_5,
    						({ location }) => ({ 2: location }),
    						({ location }) => location ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	privateroute3 = new PrivateRoute({
    			props: {
    				path: "/schedule",
    				$$slots: {
    					default: [
    						create_default_slot_4,
    						({ location }) => ({ 2: location }),
    						({ location }) => location ? 4 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route$1({
    			props: {
    				path: "/login",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/logout",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	toastcontainer = new ToastContainer({
    			props: {
    				placement: "bottom-right",
    				$$slots: {
    					default: [
    						create_default_slot_1,
    						({ data }) => ({ 1: data }),
    						({ data }) => data ? 2 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			main = element("main");
    			div = element("div");
    			create_component(privateroute0.$$.fragment);
    			t1 = space();
    			create_component(privateroute1.$$.fragment);
    			t2 = space();
    			create_component(privateroute2.$$.fragment);
    			t3 = space();
    			create_component(privateroute3.$$.fragment);
    			t4 = space();
    			create_component(route0.$$.fragment);
    			t5 = space();
    			create_component(route1.$$.fragment);
    			t6 = space();
    			create_component(toastcontainer.$$.fragment);
    			attr_dev(div, "class", "wrapper svelte-1r97ayh");
    			add_location(div, file, 21, 4, 679);
    			attr_dev(main, "class", "svelte-1r97ayh");
    			add_location(main, file, 20, 2, 668);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			mount_component(privateroute0, div, null);
    			append_dev(div, t1);
    			mount_component(privateroute1, div, null);
    			append_dev(div, t2);
    			mount_component(privateroute2, div, null);
    			append_dev(div, t3);
    			mount_component(privateroute3, div, null);
    			append_dev(div, t4);
    			mount_component(route0, div, null);
    			append_dev(div, t5);
    			mount_component(route1, div, null);
    			append_dev(div, t6);
    			mount_component(toastcontainer, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$isLoggedIn*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*$isLoggedIn*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const privateroute0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				privateroute0_changes.$$scope = { dirty, ctx };
    			}

    			privateroute0.$set(privateroute0_changes);
    			const privateroute1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				privateroute1_changes.$$scope = { dirty, ctx };
    			}

    			privateroute1.$set(privateroute1_changes);
    			const privateroute2_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				privateroute2_changes.$$scope = { dirty, ctx };
    			}

    			privateroute2.$set(privateroute2_changes);
    			const privateroute3_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				privateroute3_changes.$$scope = { dirty, ctx };
    			}

    			privateroute3.$set(privateroute3_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const toastcontainer_changes = {};

    			if (dirty & /*$$scope, data*/ 10) {
    				toastcontainer_changes.$$scope = { dirty, ctx };
    			}

    			toastcontainer.$set(toastcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(privateroute0.$$.fragment, local);
    			transition_in(privateroute1.$$.fragment, local);
    			transition_in(privateroute2.$$.fragment, local);
    			transition_in(privateroute3.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(toastcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(privateroute0.$$.fragment, local);
    			transition_out(privateroute1.$$.fragment, local);
    			transition_out(privateroute2.$$.fragment, local);
    			transition_out(privateroute3.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(toastcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(privateroute0);
    			destroy_component(privateroute1);
    			destroy_component(privateroute2);
    			destroy_component(privateroute3);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(toastcontainer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(15:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope, $isLoggedIn*/ 9) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $isLoggedIn;
    	validate_store(isLoggedIn, 'isLoggedIn');
    	component_subscribe($$self, isLoggedIn, $$value => $$invalidate(0, $isLoggedIn = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		ToastContainer,
    		FlatToast,
    		isLoggedIn,
    		Login,
    		Home,
    		Students,
    		Absence,
    		NavBar,
    		PrivateRoute,
    		Logout,
    		Schedule,
    		$isLoggedIn
    	});

    	return [$isLoggedIn];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
