var validator = (function () {
    var validators = {
        "email": function (e) {
            return e.getValue().length > 3;
        },
        "text-length": function(e) {
            return e.getValue().length > e.el.dataset.validatorMinLength && e.getValue().length < e.el.dataset.validatorMaxLength;
        }
    }

    var _itemConstructor = function (el) {
        return {
            el: el,
            validation: function () {
                return validators[this.el.dataset.validatorType](this);
            },
            getValue: function () {
                return this.el.value;
            }
        }
    }

    var _formConstructor = function (formElement, callback) {
        var _ = {
            el: formElement,
            items: [],
            callback: callback,
            init: function () {
                _.el.addEventListener('submit', function (e) {
                    e.preventDefault();

                    for (var i = 0; i < _.items.length; i++) {
                        var status = _.items[i].validation();

                        if (_.callback) {
                            _.callback(_.items[i], status);
                        }
                    }
                })

                for (var i = 0; i < _.el.getElementsByTagName('input').length; i++) {
                    if (_.el.getElementsByTagName('input')[i].dataset.validatorType) {
                        _.items.push(_itemConstructor(_.el.getElementsByTagName('input')[i]));
                    }
                }

                return _;
            }
        }

        return _;
    }

    var _app = {
        forms: [],
        addForm: function (formElement, callabck) {
            if (formElement) {
                _app.forms.push(_formConstructor(formElement, callabck).init());
            }
        }
    }

    return {
        addForm: _app.addForm
    }
})();