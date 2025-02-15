'use strict';

function _classCallCheck(instance, Constructor) {
    if (!_instanceof(instance, Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}

function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ('value' in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}

function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}

function _typeof(obj) {
    '@babel/helpers - typeof';
    if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof = function _typeof(obj) {
            return typeof obj;
        };
    } else {
        _typeof = function _typeof(obj) {
            return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
        };
    }
    return _typeof(obj);
}

function _instanceof(left, right) {
    if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
import $ from 'jquery';
import * as THREE from './three.module.min';

export default function INIT_FLY() {
    'use strict';

    this.scene;
    this.camera;
    this.renderer;
    this.controls;
    this.GId = '';
    this.tipconts;
    this.container;
    this.parentCont;
    this.Tweens = [];
    this.Result = false;

    this.init = function (cts, config) {
        var conts = parseCts(cts);

        if (detector() && conts != null) {
            try {
                var config = config || {};
                df_Config = $.extend(true, {}, defaultConfig, config);
                thm.parentCont = conts;
                thm.GId += THREE.Math.generateUUID();
                var TId = conts.attr('id') + '_' + thm.GId;
                thm.container = creatContainer(TId);
                thm.parentCont.html(thm.container);

                // try {
                //   InitFbx();
                // } catch (err) {
                //   console.log("缺少加载FBX文件");
                // }

                // try {
                //     InitControls();
                // } catch (err) {
                //     console.log('缺少Controls文件');
                // }

                // if (df_Config.loading) loading(thm.container);
                // creatTips(thm.container);
                loadTexture();
                initiate();
                init3DMesh();
                is_Init = true;
            } catch (e) {
                thm.Result = 'error! Initialization Error!';
                console.log(e);
                creatError(conts);
                return;
            }
        } else thm.Result = 'error! Not Support WebGL!';
    };

    this.render = function (func) {
        if (is_Init) {
            if (!testing()) return;
            removeLoading(thm.container);
            if (is_Stats) df_Stats.begin();
            renderers(func);
            initTween();
        }
    };

    this.rotaScene = function (angle, times) {
        if (is_Init) {
            angle = isNaN(angle * 1) ? 0 : Math.max(0, angle);
            times = isNaN(times * 1) ? 1 : Math.max(100, times);
            rotateScene(angle, times);
        }
    };

    this.disposeRender = function () {
        if (is_Init && testing()) {
            removeEvent();
            thm.controls.dispose();
            thm.container.remove();
            // thm.renderer.forceContextLoss();
            thm.renderer.domElement = null;
            thm.renderer.context = null;
            thm.renderer = null;
            is_Init = false;
        }
    };

    var thm = this;
    var df_Stats,
        is_Stats = false; //stats

    var df_Raycaster,
        df_Mouse,
        df_Intersects,
        df_MouseEvent = false; //tips

    var df_Clock,
        df_Width = 0,
        df_Height = 0,
        is_Init = false,
        df_Config = {}; //essential

    var defaultConfig = {
        stats: false,
        loading: false,
        background: {
            color: '#1E1F22',
            opacity: 1
        },
        camera: {
            fov: 45,
            near: 32,
            far: 10000,
            position: [0, 256, 512]
        },
        controls: {
            enablePan: true,
            enableZoom: true,
            enableRotate: true,
            enableDamping: true,
            //是否阻尼
            dampingFactor: 0.1,
            //阻尼系数
            keyPanSpeed: 5.0,
            panSpeed: 0.1,
            //平移系数
            zoomSpeed: 0.1,
            //缩放系数
            rotateSpeed: 0.013,
            //旋转系数
            distance: [64, 2048],
            //缩放距离区间
            polarAngle: [0, Math.PI * 0.43],
            //上下旋转区间
            azimuthAngle: [-Infinity, Infinity] //左右旋转区间
        },
        light: {
            Ambient: {
                color: '#FFFFFF',
                strength: 1.0
            },
            isHemisphere: false,
            hemisphere: {
                color: '#EFEFEF',
                groundColor: '#EFEFEF',
                strength: 0.7,
                position: [0, 0, 2000]
            }
        },
        backMap: {
            texture: null,
            opacity: 1,
            lw: [0, 0],
            position: [0, 0, 0],
            side: true
        },
        texture: {}
    };
    var LineMange = {
        id: 0,
        state: false,
        active: null,
        lines: [],
        current: {
            data: [],
            id: 0
        },
        keyStart: function keyStart() {
            if (this.state) return false;
            this.state = true;
            this.restore();
        },
        // 按键结束
        keyEnd: function keyEnd() {
            this.state = false;

            if (this.current.data.length < 2) {
                return false;
            }

            this.lines.push(this.current);
        },
        add: function add(vec) {
            if (!vec || !this.state) return false;
            this.current.data.push(vec);
        },
        remove: function remove(id) {
            this.lines = this.lines.filter(function (elem) {
                return elem.id != id;
            });
        },
        get: function get() {
            return JSON.parse(JSON.stringify(this.lines));
        },
        restoreData: function restoreData(items) {
            var _this = this;

            items.forEach(function (item) {
                _this.id = item.id > _this.id ? item.id : _this.id;
            });
            this.lines = items;
            this.state = false;
        },
        restore: function restore() {
            this.current = {
                data: [],
                id: this.getId()
            };
        },
        getId: function getId() {
            return this.id++;
        }
    };
    var txues = {};
    var width = 0;
    var height = 0;
    var ray_arr = [];

    function initiate() {
        thm.scene = new THREE.Scene();
        df_Clock = new THREE.Clock();
        var wh = getWH();
        df_Width = wh.w;
        df_Height = wh.h;
        var cm = df_Config.camera,
            bg = df_Config.background;
        width = thm.container.width();
        height = thm.container.height();
        thm.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000); //
        //thm.camera.lookAt({ x: 0, y: 0, z: 100 });

        thm.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        thm.renderer.setSize(df_Width, df_Height);
        thm.renderer.setClearColor(bg.color, bg.opacity); // controls

        thm.controls = new THREE.OrbitControls(thm.camera, thm.container[0]);
        setControls(thm.controls, df_Config.controls);
        setLight(thm.scene, df_Config.light); // state

        is_Stats = df_Config.stats === true ? true : false;

        if (is_Stats) {
            df_Stats = new Stats();
            thm.container.append($(df_Stats.dom));
        }

        thm.container.append($(thm.renderer.domElement));
        window.addEventListener('resize', onWindowResize, false); // mouse event

        df_Raycaster = new THREE.Raycaster();
        df_Mouse = new THREE.Vector2();
        thm.renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
        thm.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    }
    var baseImg =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuUlEQVRYR82XPy8EURTFf6fWUlD5k9ALhYLQkkgUJAql6HwFfAQqG6VCQiGR0BIKCaK3ibUVBSX1lSfzZGd3ZmdnZ2Z3XzLF5N177pm59913rkixzGweWAFmgIHgcQifwXMPnEu6aRVWSYZmNghsAevAeJJ9sF8GToCSpI9mPk0JmNkusAkMtRi43uwdOJLkcCJXLAEzuwVm2wxc73YnaS4KK5KAmbmc9ucU3MN8SXJ1E1oNBMzsDRjOObiHq0oaqcUOETCzU2C1oOAe9kzSmn/5JxAU3E7BwT38ni/MPwLBUXvKUO1pebvTMeWOqCfgjkmnvj70FzyBV2A07WdktK9IGpOZLQKXGcHadV9yBA6DVtsuSBa/kiPwAExnQcng++gIFNl4krhVHYFvoC/JsqD9n54g0PUUdL0I94HtgnKcBHvgasDpvOsky4L2F3wrfkmh9/LiUpY00TOXkVO+3buOA03QySs5LEh8UnNWwnG1ElLIUaK0CEXsyTQo4zhZXkR3bFDEjlWzwSRPhRxSwrGyvD5pXR3NagrTD6cbKXRjBTjOPJxG/BGnH5eByZjx/Bm4kHTVarv8BfUiqvAfUSxCAAAAAElFTkSuQmCC';
    var pointImg =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABuUlEQVRYR82XPy8EURTFf6fWUlD5k9ALhYLQkkgUJAql6HwFfAQqG6VCQiGR0BIKCaK3ibUVBSX1lSfzZGd3ZmdnZ2Z3XzLF5N177pm59913rkixzGweWAFmgIHgcQifwXMPnEu6aRVWSYZmNghsAevAeJJ9sF8GToCSpI9mPk0JmNkusAkMtRi43uwdOJLkcCJXLAEzuwVm2wxc73YnaS4KK5KAmbmc9ucU3MN8SXJ1E1oNBMzsDRjOObiHq0oaqcUOETCzU2C1oOAe9kzSmn/5JxAU3E7BwT38ni/MPwLBUXvKUO1pebvTMeWOqCfgjkmnvj70FzyBV2A07WdktK9IGpOZLQKXGcHadV9yBA6DVtsuSBa/kiPwAExnQcng++gIFNl4krhVHYFvoC/JsqD9n54g0PUUdL0I94HtgnKcBHvgasDpvOsky4L2F3wrfkmh9/LiUpY00TOXkVO+3buOA03QySs5LEh8UnNWwnG1ElLIUaK0CEXsyTQo4zhZXkR3bFDEjlWzwSRPhRxSwrGyvD5pXR3NagrTD6cbKXRjBTjOPJxG/BGnH5eByZjx/Bm4kHTVarv8BfUiqvAfUSxCAAAAAElFTkSuQmCC';
    function init3DMesh(opts) {
        thm.flyMesh = new InitFly({
            texture: pointImg
        });
        /*
    do something
    */
        // 加载背景图
        // 创建连线的线条

        thm.lines = createLine();
        thm.scene.add(thm.lines);
    }

    thm.initFly = function (items, opts) {
        var color = opts.color,
            style = opts.style,
            size = opts.size,
            length = opts.length,
            speed = opts.speed,
            dpi = opts.dpi;
        thm.flyGroup = new THREE.Group();
        var txueLoader = new THREE.TextureLoader();
        items.forEach(function (elem, i) {
            var points = thm.flyMesh.tranformPath(elem.data, dpi);
            var _color = elem.color != undefined ? new THREE.Color(elem.color) : color;
            const config = {
                color: _color,
                curve: points,
                width: size,
                length: length,
                speed: speed,
                repeat: Infinity,
                style: style
            };
            if (elem.img) {
                config.texture = txueLoader.load(df_Config.assets + elem.img);
            }
            var flyMesh = thm.flyMesh.addFly(config);
            flyMesh._tid = elem.id;
            thm.flyGroup.add(flyMesh);
        });
        thm.scene.add(thm.flyGroup);
    };

    function createLine() {
        //粒子 shader
        var Shader = {
            vertexShader: 'attribute float select;varying float selectState;void main(){selectState = select;vec4 myPosition = modelViewMatrix * vec4(position ,1.0);gl_Position = projectionMatrix * myPosition;}',
            fragmentShader: 'varying float selectState;uniform vec3 color;uniform vec3 active_color;void main(){if (selectState == 1.0) {gl_FragColor = vec4(active_color,1.0);} else {gl_FragColor = vec4(color,1.0);}}'
        };
        var material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            uniforms: {
                color: {
                    value: new THREE.Color('#FFF')
                },
                active_color: {
                    value: new THREE.Color('#ff0000')
                }
            },
            vertexShader: Shader.vertexShader,
            fragmentShader: Shader.fragmentShader
        });
        var geometry = new THREE.BufferGeometry();
        return new THREE.LineSegments(geometry, material);
    }

    function updateLine(items) {
        var position = [];
        var select = [];
        items.forEach(function (elem) {
            var data = elem.data;

            for (var i = 0; i < data.length - 1; i++) {
                position.push(data[i].x, data[i].y + 1, data[i].z);
                position.push(data[i + 1].x, data[i + 1].y + 1, data[i + 1].z);

                if (elem.active) {
                    select.push(1, 1);
                } else {
                    select.push(0, 0);
                }
            }
        });
        thm.lines.geometry.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
        thm.lines.geometry.addAttribute('select', new THREE.Float32BufferAttribute(select, 1));
    }

    function createBackground(texture) {
        ray_arr = [];
        var geometry = new THREE.PlaneBufferGeometry(width, height, 32);
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.9,
            transparent: true,
            side: THREE.DoubleSide,
            map: texture
        });
        var plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = -Math.PI / 2;
        thm.scene.add(plane);
        ray_arr.push(plane);
    }

    function animation(dt) {
        if (dt > 0.5) return false;
        if (thm.flyMesh) {
            thm.flyMesh.animation(dt);
        }
    } //-

    function loadTexture() {
        var txueLoader = new THREE.TextureLoader();
        var _n = df_Config.texture;

        for (var k in _n) {
            txues['_' + k] = txueLoader.load(_n[k], function (tex) {
                tex.anisotropy = 10;
                tex.minFilter = tex.magFilter = THREE.LinearFilter;
            });
        }
    } // mouse event

    function onDocumentMouseMove(event) {
        event.preventDefault();

        if (!df_MouseEvent) {
            df_Mouse.x = (event.layerX / df_Width) * 2 - 1;
            df_Mouse.y = -(event.layerY / df_Height) * 2 + 1;
            df_Raycaster.setFromCamera(df_Mouse, thm.camera); //df_Intersects = df_Raycaster.intersectObject( gusMesh );

            /*
      if ( df_Intersects.length > 0 ) {
      thm.container[0].style.cursor = 'pointer';
      	} else {
      removeTips();
      thm.container[0].style.cursor = 'auto';
      }
       */
        }
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        df_Mouse.x = (event.layerX / df_Width) * 2 - 1;
        df_Mouse.y = -(event.layerY / df_Height) * 2 + 1;
        df_Raycaster.setFromCamera(df_Mouse, thm.camera);
        var intersects = df_Raycaster.intersectObjects(ray_arr);

        if (intersects.length != 0 && event.buttons == 1) {
        } else {
        }
    }

    function onWindowResize(event) {
        var wh = getWH();
        df_Width = wh.w;
        df_Height = wh.h;
        thm.camera.aspect = wh.w / wh.h;
        thm.renderer.setSize(wh.w, wh.h);
        thm.controls.reset();
    }

    function renderers(func) {
        var fnc = toFunction(func);

        var Animations = function Animations() {
            if (is_Init) {
                fnc.bind(thm)();
                var delta = df_Clock.getDelta();
                if (delta > 0) animation(delta);
                thm.controls.update();
                if (is_Stats) df_Stats.update(); //thm.camera.lookAt({ x: 0, y: 0, z: 100 });

                requestAnimationFrame(Animations);
                thm.renderer.render(thm.scene, thm.camera);
            }
        };

        Animations();
    }

    function testing() {
        return _instanceof(thm.renderer, THREE.WebGLRenderer);
    }

    function rotateScene(angle, times) {
        var ay = thm.scene.rotation.y + angle;
        new TWEEN.Tween(thm.scene.rotation)
            .to(
                {
                    y: ay
                },
                times
            )
            .start();
    }

    function initTween() {
        for (var k = thm.Tweens.length - 1; k >= 0; k--) {
            thm.Tweens[k].start(TWEEN.now());
        }
    }

    function getWH() {
        return {
            w: thm.container.width(),
            h: thm.container.height()
        };
    }

    function setControls(controls, opts) {
        controls.enablePan = opts.enablePan;
        controls.enableKeys = opts.enablePan;
        controls.enableZoom = opts.enableZoom;
        controls.enableRotate = opts.enableRotate;
        controls.enableDamping = opts.enableDamping;
        controls.dampingFactor = opts.dampingFactor;
        controls.keyPanSpeed = opts.keyPanSpeed;
        controls.panSpeed = opts.panSpeed;
        controls.zoomSpeed = opts.zoomSpeed;
        controls.rotateSpeed = opts.rotateSpeed;
        controls.minDistance = opts.distance[0];
        controls.maxDistance = opts.distance[1];
        controls.minPolarAngle = opts.polarAngle[0];
        controls.maxPolarAngle = opts.polarAngle[1];
        controls.minAzimuthAngle = opts.azimuthAngle[0];
        controls.maxAzimuthAngle = opts.azimuthAngle[1]; // controls.mouseDownPrevent = opts.mouseDownPrevent;
    }

    function setLight(scene, opts) {
        scene.add(new THREE.AmbientLight(opts.Ambient.color, opts.Ambient.strength));

        if (opts.isHemisphere) {
            var lh = opts.hemisphere,
                hLight = new THREE.HemisphereLight(lh.color, lh.groundColor, lh.strength);
            hLight.position.set(lh.position[0], lh.position[2], lh.position[1]);
            scene.add(hLight);
        }
    }

    function detector() {
        try {
            return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
        } catch (e) {
            return false;
        }
    }

    function isFunction(a) {
        return Object.prototype.toString.call(a) === '[object Function]';
    }

    function toFunction(a) {
        var b = Object.prototype.toString.call(a) === '[object Function]';
        return b ? a : function (o) {};
    }

    function parseCts(cts) {
        var $dom = _typeof(cts) == 'object' ? $(cts) : $('#' + cts);
        if ($dom.length <= 0) return null;
        return $dom;
    }

    function removeEvent() {
        window.removeEventListener('resize', onWindowResize, false);
        thm.renderer.domElement.removeEventListener('mousemove', onDocumentMouseMove, false);
        thm.renderer.domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
    } //tips

    function creatTips(container) {
        var tmp = {
            tipCont: '<div id="GM_tips"></div>',
            icon: '<i></i>',
            txt: '<span id="DM_txt"></span>',
            bage: '<div></div>'
        };
        var tipcont = $(tmp.tipCont).css({
            position: 'absolute',
            left: '0',
            top: '0',
            display: 'none',
            'z-index': '30000'
        });
        tipcont.append(
            $(tmp.bage).css({
                position: 'absolute',
                background: '#000',
                opacity: '0.3',
                'border-radius': '5px',
                height: '100%',
                width: '100%'
            })
        );
        tipcont.append(
            $(tmp.bage)
                .css({
                    position: 'relative',
                    padding: '4px 6px',
                    color: '#fff',
                    'font-size': '12px',
                    'margin-left': '10px'
                })
                .append(
                    $(tmp.icon).css({
                        border: '3px solid #fff',
                        position: 'absolute',
                        left: '-2px',
                        'margin-top': '6px',
                        'border-radius': '3px'
                    })
                )
                .append(
                    $(tmp.txt)
                        .css({
                            position: 'relative',
                            padding: '4px 6px',
                            color: '#fff;',
                            'font-size': '12px'
                        })
                        .html('')
                )
        );
        thm.tipconts = tipcont;
        $(container).append(tipcont);
    }

    function removeTips() {
        thm.tipconts.css('display', 'none');
        thm.tipconts.find('span#DM_txt').html('');
    }

    function setTips(conts, position) {
        var vec2 = transCoord(position),
            tmx = Math.max(10, Math.min(df_Width - 40, vec2.x + 6)),
            tmy = Math.max(10, Math.min(df_Height - 34, vec2.y - 12));
        thm.tipconts.css({
            left: tmx,
            top: tmy,
            display: 'block'
        });
        thm.tipconts.find('span#DM_txt').html(conts);
    }

    function transCoord(position) {
        var halfW = df_Width / 2,
            halfH = df_Height / 2,
            vec3 = position.clone().applyMatrix4(thm.scene.matrix).project(thm.camera),
            mx = Math.round(vec3.x * halfW + halfW),
            my = Math.round(-vec3.y * halfH + halfH);
        return new THREE.Vector2(mx, my);
    } // loading

    function loading(container) {
        var loading = $('<div id="t_loading"></div>');
        loading.css({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            'z-index': 20000
        });
        var loadImg =
            'data:image/gif;base64,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';
        loading.css('background', '#000000 url(' + loadImg + ') center center no-repeat');
        $(container).append(loading);
    }

    function removeLoading(container) {
        $(container).children('div#t_loading').css({
            background: 'none',
            display: 'none'
        });
    }

    function creatContainer(id) {
        var containers = $('<div></div>');
        containers.css('cssText', 'height:100%;width:100%;position:relative !important');
        containers.attr('id', id);
        return containers;
    }

    function creatError(conts, errorText) {
        var error = $('<div class="data-error"></div>'),
            error_text = errorText || '数据错误。。。';

        if (undefined != conts) {
            var ctxt = 'color:#fff;position:absolute;top:49%;width:100%;text-align:center;';
            error.css('cssText', ctxt);
            conts.html(error.html(error_text));
        }
    }

    var InitFly = /*#__PURE__*/ (function () {
        function InitFly() {
            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : opt,
                texture = _ref.texture,
                _ref$style = _ref.style,
                style = _ref$style === void 0 ? 1 : _ref$style;

            _classCallCheck(this, InitFly);

            this.flyId = 0; //id

            this.flyArr = []; //存储所有飞线

            this.baicSpeed = 1; //基础速度

            this.texture = 0.0;

            if (texture && !texture.isTexture) {
                this.texture = new THREE.TextureLoader().load(texture);
            } else {
                this.texture = texture;
            }
        }
        /**
         * [addFly description]
         *
         * @param   {String}  opt.color  [颜色_透明度]
         * @param   {Array}   opt.curve  [线的节点]
         * @param   {Number}  opt.width  [宽度]
         * @param   {Number}  opt.length [长度]
         * @param   {Number}  opt.speed  [速度]
         * @param   {Number}  opt.repeat [重复次数]
         * @return  {Mesh}               [return 图层]
         */

        _createClass(InitFly, [
            {
                key: 'addFly',
                value: function addFly() {
                    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : opt,
                        _ref2$color = _ref2.color,
                        color = _ref2$color === void 0 ? 'rgba(255,255,255,1)' : _ref2$color,
                        _ref2$curve = _ref2.curve,
                        curve = _ref2$curve === void 0 ? [] : _ref2$curve,
                        _ref2$width = _ref2.width,
                        width = _ref2$width === void 0 ? 1 : _ref2$width,
                        _ref2$length = _ref2.length,
                        length = _ref2$length === void 0 ? 10 : _ref2$length,
                        _ref2$speed = _ref2.speed,
                        speed = _ref2$speed === void 0 ? 1 : _ref2$speed,
                        _ref2$repeat = _ref2.repeat,
                        repeat = _ref2$repeat === void 0 ? 1 : _ref2$repeat,
                        _ref2$texture = _ref2.texture,
                        texture = _ref2$texture === void 0 ? null : _ref2$texture,
                        _ref2$style = _ref2.style,
                        style = _ref2$style === void 0 ? 1 : _ref2$style,
                        callback = _ref2.callback;

                    var flyShader = this.getShader(style);
                    var colorArr = this.getColorArr(color);
                    var geometry = new THREE.BufferGeometry();
                    var material = new THREE.ShaderMaterial({
                        uniforms: {
                            color: {
                                value: colorArr[0],
                                type: 'v3'
                            },
                            size: {
                                value: width,
                                type: 'f'
                            },
                            texture: {
                                value: texture ? texture : this.texture,
                                type: 't2'
                            },
                            u_len: {
                                value: length,
                                type: 'f'
                            },
                            u_opacity: {
                                value: colorArr[1],
                                type: 'f'
                            },
                            time: {
                                value: -length,
                                type: 'f'
                            },
                            isTexture: {
                                value: 1.0,
                                type: 'f'
                            }
                        },
                        transparent: true,
                        depthWrite: false,
                        vertexShader: flyShader.vertexshader,
                        fragmentShader: flyShader.fragmentshader
                    });
                    var position = [],
                        u_index = [];
                    curve.forEach(function (elem, index) {
                        position.push(elem.x, elem.y, elem.z);
                        u_index.push(index);
                    });
                    geometry.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
                    geometry.addAttribute('u_index', new THREE.Float32BufferAttribute(u_index, 1));
                    var mesh = new THREE.Points(geometry, material);
                    mesh.name = 'fly';
                    mesh._flyId = this.flyId;
                    mesh._speed = speed;
                    mesh._repeat = repeat;
                    mesh._been = 0;
                    mesh._total = curve.length;
                    mesh._callback = callback;
                    this.flyId++;
                    this.flyArr.push(mesh);
                    return mesh;
                }
            },
            {
                key: 'getShader',
                value: function getShader() {
                    var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
                    var shader;

                    switch (style) {
                        case 1:
                            shader = {
                                vertexshader: [
                                    'uniform float size;uniform float time;uniform float u_len;attribute float u_index;varying float u_opacitys; ',
                                    'void main() { if( u_index < time + u_len && u_index > time){float u_scale = 1.0 - (time + u_len - u_index) /u_len;',
                                    'u_opacitys = u_scale;vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
                                    'gl_Position = projectionMatrix * mvPosition;gl_PointSize = size * u_scale * 300.0 / (-mvPosition.z);}} '
                                ].join('\n'),
                                fragmentshader: [
                                    'uniform sampler2D texture;uniform float u_opacity;uniform vec3 color; uniform float isTexture;varying float u_opacitys;',
                                    'void main() {vec4 u_color = vec4(color,u_opacity * u_opacitys);if( isTexture != 0.0 ){',
                                    'gl_FragColor = u_color * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));  }else{',
                                    'gl_FragColor = u_color; } }'
                                ].join('\n')
                            };
                            break;

                        case 2:
                            shader = {
                                vertexshader: [
                                    'uniform float size; ',
                                    'uniform float time; ',
                                    'uniform float u_len; ',
                                    'attribute float u_index;',
                                    'varying float u_opacitys;',
                                    'void main(){',
                                    'if( u_index < time + u_len && u_index > time){',
                                    'float u_scale = size * 0.5;',
                                    'float curr = (time + u_len - u_index);',
                                    'if (curr / u_len <= 0.015) { u_scale = size ; }',
                                    'if (curr / u_len <= 0.25 && curr / u_len > 0.24) { u_scale = size; }',
                                    'if (curr / u_len <= 0.50 && curr / u_len > 0.49) { u_scale = size;}',
                                    'if (curr / u_len <= 0.75 && curr / u_len > 0.74) { u_scale = size ;}',
                                    'u_opacitys = 1.0 - (time + u_len - u_index) /u_len;',
                                    'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
                                    'gl_Position = projectionMatrix * mvPosition;',
                                    'gl_PointSize =   u_scale * 300.0 / (-mvPosition.z);}}'
                                ].join('\n'),
                                fragmentshader: [
                                    'uniform sampler2D texture;',
                                    'uniform float u_opacity;',
                                    'uniform vec3 color;',
                                    'uniform float isTexture;',
                                    'varying float u_opacitys;',
                                    'void main() {',
                                    'vec4 u_color = vec4(color,u_opacity * u_opacitys);',
                                    'if( isTexture != 0.0 ){',
                                    'gl_FragColor = u_color * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));',
                                    '}else{',
                                    'gl_FragColor = u_color;}} '
                                ].join('\n')
                            };
                            break;
                        case 3:
                            shader = {
                                vertexshader: [
                                    'uniform float size;uniform float time;uniform float u_len;attribute float u_index;varying float u_opacitys; ',
                                    'void main() { ',
                                    'if( u_index < time + u_len && u_index > time){float u_scale = 1.0 - (time + u_len - u_index) /u_len;',
                                    'u_opacitys =u_scale;vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
                                    'gl_Position = projectionMatrix * mvPosition;gl_PointSize = sin(u_scale * 3.1415926) * 300.0 / (-mvPosition.z);}} '
                                ].join('\n'),
                                fragmentshader: [
                                    'uniform sampler2D texture;uniform float u_opacity;uniform vec3 color; uniform float isTexture;varying float u_opacitys;',
                                    'void main() {vec4 u_color = vec4(color,u_opacity * u_opacitys);if( isTexture != 0.0 ){',
                                    'gl_FragColor = u_color * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));  }else{',
                                    'gl_FragColor = u_color; } }'
                                ].join('\n')
                            };
                            break;
                        case 4:
                            shader = {
                                vertexshader: [
                                    'uniform float size;',
                                    'uniform float time;',
                                    'attribute float u_index;',
                                    'varying float u_opacitys;',
                                    'void main(){',
                                    'u_opacitys = 0.0;',
                                    'float _floor = floor(time);',
                                    'if (u_index == _floor) { u_opacitys = 1.0; };',
                                    'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
                                    'gl_Position = projectionMatrix * mvPosition;',
                                    'gl_PointSize = size * 300.0 / (-mvPosition.z);}'
                                ].join('\n'),
                                fragmentshader: [
                                    'uniform sampler2D texture;',
                                    'uniform float u_opacity;',
                                    'uniform vec3 color;',
                                    'uniform float isTexture;',
                                    'varying float u_opacitys;',
                                    'void main() {',
                                    'vec4 u_color = vec4(color, u_opacity * u_opacitys);',
                                    'if( isTexture != 0.0 ){',
                                    'gl_FragColor = u_color * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));',
                                    '}else{',
                                    'gl_FragColor = u_color;}} '
                                ].join('\n')
                            };
                            break;
                        case 5:
                            shader = {
                                vertexshader: [
                                    'uniform float size; ',
                                    'uniform float time; ',
                                    'uniform float u_len; ',
                                    'attribute float u_index;',
                                    'varying float u_opacitys;',
                                    'void main(){',
                                    'if( u_index < time + u_len && u_index > time){',
                                    'float u_scale = (u_index - time) / ((time + u_len) - time);',
                                    'u_opacitys = 0.1 * u_scale;',
                                    'if (u_index < time + u_len && u_index > time + u_len - 1.9) { u_opacitys = 1.0; }',
                                    'vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
                                    'gl_Position = projectionMatrix * mvPosition;',
                                    'gl_PointSize = size * 300.0 / (-mvPosition.z);}}'
                                ].join('\n'),
                                fragmentshader: [
                                    'uniform sampler2D texture;',
                                    'uniform float u_opacity;',
                                    'uniform vec3 color;',
                                    'uniform float isTexture;',
                                    'varying float u_opacitys;',
                                    'void main() {',
                                    'vec4 u_color = vec4(color,u_opacity * u_opacitys);',
                                    'if( isTexture != 0.0 ){',
                                    'gl_FragColor = u_color * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));',
                                    '}else{',
                                    'gl_FragColor = u_color;}} '
                                ].join('\n')
                            };
                            break;
                    }

                    return shader;
                }
                /**
                 * 根据线条组生成路径
                 * @param {*} arr 需要生成的线条组
                 * @param {*} dpi 密度
                 */
            },
            {
                key: 'tranformPath',
                value: function tranformPath(arr) {
                    var dpi = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                    var vecs = [];

                    for (var i = 1; i < arr.length; i++) {
                        var src = arr[i - 1];
                        var dst = arr[i];
                        var s = new THREE.Vector3(src.x, src.y, src.z);
                        var d = new THREE.Vector3(dst.x, dst.y, dst.z);
                        var length = s.distanceTo(d) * dpi;
                        var len = parseInt(length);

                        for (var _i = 0; _i <= len; _i++) {
                            vecs.push(s.clone().lerp(d, _i / len));
                        }
                    }

                    return vecs;
                }
                /**
                 * [remove 删除]
                 * @param   {Object}  mesh  [当前飞线]
                 */
            },
            {
                key: 'remove',
                value: function remove(mesh) {
                    mesh.material.dispose();
                    mesh.geometry.dispose();
                    this.flyArr = this.flyArr.filter(function (elem) {
                        return elem._flyId != mesh._flyId;
                    });
                    mesh.parent.remove(mesh);
                    mesh = null;
                }
                /**
                 * [animation 动画]
                 * @param   {Number}  delta  [执行动画间隔时间]
                 */
            },
            {
                key: 'animation',
                value: function animation() {
                    var _this2 = this;

                    var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.015;
                    if (delta > 0.2) return;
                    this.flyArr.forEach(function (elem) {
                        if (!elem.parent) return;

                        if (elem._been > elem._repeat) {
                            elem.visible = false;

                            if (typeof elem._callback === 'function') {
                                elem._callback(elem);
                            }

                            _this2.remove(elem);
                        } else {
                            var uniforms = elem.material.uniforms; //完结一次

                            if (uniforms.time.value < elem._total) {
                                uniforms.time.value += delta * (_this2.baicSpeed / delta) * elem._speed;
                            } else {
                                elem._been += 1;
                                uniforms.time.value = -uniforms.u_len.value;
                            }
                        }
                    });
                }
            },
            {
                key: 'color',
                value: function color(c) {
                    return new THREE.Color(c);
                }
            },
            {
                key: 'getColorArr',
                value: function getColorArr(str) {
                    if (Array.isArray(str)) return str; //error

                    var _arr = [];
                    str = str + '';
                    str = str.toLowerCase().replace(/\s/g, '');

                    if (/^((?:rgba)?)\(\s*([^)]*)/.test(str)) {
                        var arr = str.replace(/rgba\(|\)/gi, '').split(',');
                        var hex = [pad2(Math.round(arr[0] * 1 || 0).toString(16)), pad2(Math.round(arr[1] * 1 || 0).toString(16)), pad2(Math.round(arr[2] * 1 || 0).toString(16))];
                        _arr[0] = this.color('#' + hex.join(''));
                        _arr[1] = Math.max(0, Math.min(1, arr[3] * 1 || 0));
                    } else if ('transparent' === str) {
                        _arr[0] = this.color();
                        _arr[1] = 0;
                    } else {
                        _arr[0] = this.color(str);
                        _arr[1] = 1;
                    }

                    function pad2(c) {
                        return c.length == 1 ? '0' + c : '' + c;
                    }

                    return _arr;
                }
            }
        ]);

        return InitFly;
    })();
}
