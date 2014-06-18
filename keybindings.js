var keybindings = {
    listBindings: function(bindings, actions, ul) {
        var key, li, a, actionName,
            fragment = document.createDocumentFragment();

        for (key in bindings) {
            actionName = bindings[key];
            li = document.createElement('li');
            li.textContent = key + ' to ';
            a = document.createElement('a');
            a.href = '#';
            a.textContent = actions[actionName].description;
            a.addEventListener('click', actions[actionName].callback);
            li.appendChild(a);
            fragment.appendChild(li);
        }
        ul.appendChild(fragment);
    },

    bindKeys: function(bindings, actions) {
        function toChar(code) {
            return String.fromCharCode(code);
        }

        document.addEventListener('keypress', function(event) {
            var action = actions[bindings[toChar(event.charCode)]];
            if (action) {
                action.callback();
                event.stopPropagation();
                event.preventDefault();
            }
        });
    }
};
