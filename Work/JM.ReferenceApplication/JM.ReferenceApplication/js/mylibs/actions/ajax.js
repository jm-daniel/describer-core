define(['jquery', '_super', 'rAF'], function ($, _super){
    'use strict';
	// extend von module.formcomponents.autocomplete
	// extend von module.modal
    var ajax = $.extend({}, _super, {
        init: function (options, elem) {
            this.options = $.extend({}, this.options, options);
            this.name = this.options.pluginName;
            this.pos = this.options.pos;
	        this.jmname = this.options.jmname;
            this.$elem = $(elem);
            _super.config.call(this);
            this.onInitExec();
            return this;
        },

        onInitExec: function () {
            this.loader = this.is('loader');
            if(this.loader !== ''){
                switch(this.loader){
                    case 'sticky':
                        this.$ani = $('<div class="loader-sticky">'+
                                        '<div class="rect1"></div>'+
                                        '<div class="rect2"></div>'+
                                        '<div class="rect3"></div>'+
                                        '<div class="rect4"></div>'+
                                        '<div class="rect5"></div>'+
                                    '</div> ');
                    break;
	                case 'spinner':
		                this.$ani = $('<div class="loading-container"><div class="loading"></div></div>');
	                break;
	                case 'none':
		            break;
                    default:
                        this.$ani = $('<div class="loader">'+
                                        '<div class="rect1"></div>'+
                                        '<div class="rect2"></div>'+
                                        '<div class="rect3"></div>'+
                                        '<div class="rect4"></div>'+
                                        '<div class="rect5"></div>'+
                                    '</div> ');
                    break;
                }
            }else{
                this.$ani = $('<div class="loading-container"><div class="loading"></div></div>');
            }
	        if(this.is('additionalloadertarget') !== ''){
		        this.$additionalloader = $('<div class="loading-container"><div class="loading"></div></div>');
	        }
            
            //this._exec();
            //{ url:'/bla', data:'parameter', method:'post', destination:'data-jmconfig*=domselectro:exampleID', inject:'before/after/prepend/append/html(replace)' }
        },

        options: {

        },

        _render: function(){
		    // !!!!! this.$elem.offset().top === 0 after remove/delet this element !!!!!
		    if(eval(this.conditionSource)){
			    window.cancelAnimationFrame(this.rAFRender);
			    this._exec();
		    }else{
			    this.rAFRender = window.requestAnimationFrame(this._render.bind(this));
		    }
	    },

        _getData: function(){
	        if(this.is('data').indexOf('this.') !== -1){
		        return eval(this.is('data'));
	        }
	        // this.is('data').match auf String mit beginnenden $$ -Zeichen dann wird die Value des Elements in das window.jmGO als Objekt $$... gespeichert.
	        // Dieses Objekt wird dann in einen Query-String umgewandelt und zurückgegeben.
	        // Somit kann einen Form-Auswahl im $$.. gespeichert werden und diese wird dann via Ajax gesendet.
            if(this.is('data').match(/^\$\$(.*)/)){
	            window.jmGO = window.jmGO || {};
	            window.jmGO[this.is('data')] = window.jmGO[this.is('data')] || {};
	            if(this.$elem[0].tagName.toLowerCase() === 'select'){
		            window.jmGO[this.is('data')][this.$elem.attr('name')] = this.$elem.val();
	            }
	            return this._convertObjToQueryString(window.jmGO[this.is('data')]);
            }

	        // ist this.$elem ein form-Tag und es wird auf den event submit gematcht, werden die Formulardaten als Querystring zurückgegebent.
            // !!! wird nicht mehr menötigt, da es jetzt möglich ist, mit data auch einen string zu evaluieren.
            /*if(this.is('event', 'submit')){
	            return this.$elem.serialize();
            }*/
			// data oder lehrString wird zuürckgegeben.
	        return  this.is('data') || '';

        },

	    _getUrl: function(){
		    if(this.is('url') !== ''){
			    return this.is('url');
		    }
		    if($.type(this.$elem.attr('href')) !== 'undefined'){
			    return this.$elem.attr('href');
		    }
	    },

        _convertObjToQueryString: function(p_Obj){
            var q = '';
            $.each(p_Obj, function(key, value){
                if(value !== ''){
                    q = q + ((q !== '') ? '&' : '') + key+'='+value;
                }
            });
            return q;
        },

        _exec: function(){
            var that = this;
	        if(this.is('additionalloadertarget') !== ''){
		        $(this.is('additionalloadertarget')).append(this.$additionalloader);
	        }
	        this._wait();
            this.$destination = this.subObj_$destination || $(this.is('relatedTo'));
	        this.injection = this.subObj_injection || this.is('inject');
            $.ajax({
                type: (that.is('method') !== '') ? ((that.is('method', 'post')) ? 'POST' : 'GET') : 'GET',
                url: that._getUrl(),
                data: that._getData(),
                beforeSend: function (){
                    that._beforeSend(that.$destination);
                }
            }).done(function (p_data) {
	            that.data = (p_data.match(/<(.*)[^>]*>/)) ? $(p_data) : p_data;
	            window.requestAnimationFrame(that._injectAfterFrame.bind(that));
            }).always(function () {

            }).fail(function () {
	            if($.type(this.$elem.data('jmtest')) !== 'undefined'){
					return;
	            }
	            that.$ani.remove();
	            if(that.is('additionalloadertarget') !== ''){
		            that.$additionalloader.remove();
	            }
            });
        },

        _beforeSend: function(p_$target){
/*	        if(this.is('inject', 'html')){
		        p_$target
			        .removeClass('visible')
			        .addClass('hidden');
	        }else{
		        p_$target
			        [this.is('inject')](this.$ani);
	        }*/
	        if($.type(this.$ani) !== 'undefined'){
		        this.$ani.css({
			        'top': jmHF.getClientHeight()/2
		        });
		        p_$target[this.injection](this.$ani);
	        }
	        if(this.is('scrollTo') !== ''){
		        this._scrollTo();
	        }
        },

        /*_inject: function(p_data){
            var data = $(p_data);
	        window.requestAnimationFrame(this._injectAfterFrame.bind(this));
	        if(this.is('inject') === 'html'){
		        this.$destination.empty();
	        }
	        this.$destination[this.is('inject')](data);
	        data
		        .requirementsForJmElements()
		        .triggerSelfexecObj()
		        .picturefill();
        },*/

	    _injectAfterFrame: function(){
		    var that = this;
		    if($.type(this.$ani) !== 'undefined'){
				this.$ani.remove();
		    }
		    if(this.is('loadertarget') !== ''){
			    this.$loadertargetani.remove();
		    }
		    if(this.injection === 'html'){
				this.$destination.empty();
		    }

		    this.$destination[this.injection](this.data);
		    //this.$destination[this.injection](this.data);
		    setTimeout(function(){
			    if($.type(that.data) !== 'string'){
				    that.data
					    .requirementsForJmElements()
					    .triggerSelfexecObj()
					    .picturefill();
			    }
			}, 200);
		    if(this.is('afterexec') === 'remove'){
		        //this.$elem.parent().data('masonry').masonry( 'appended', that.data );
			    this.$elem.remove();
		    }
		    this.ajaxCompleteCallback();
	    },

	    ajaxCompleteCallback: function(){

	    }
    });

    $.plugin('actions.ajax', ajax);
    return ajax;
});
