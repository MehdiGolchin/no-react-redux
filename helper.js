const Div = createElement('div');
const HtmlButton = createElement('button');
const Article = createElement('article');
const Header = createElement('header');
const Main = createElement('main');
const Footer = createElement('footer');
const H4 = createElement('h4');
const Input = createElement('input');
const Nav = createElement('nav');
const UL = createElement('ul');
const LI = createElement('li');
const A = createElement('a');
const HtmlForm = createElement('form');

function includeParams(fn, ...args) {
    return function () {
        fn.apply(this, Array.from(arguments).concat(args));
    }
}

function Link(text, to, onClick, children = [], options = {}) {
    return A([text, ...children], {
        href: to,
        onclick: (e) => {
            onClick(e);
            e.preventDefault();
        },
        ...options,
    });
}

function Button(children, onclick, options = {}) {
    return HtmlButton(children, {
        onclick,
        ...options
    });
}

function Form(children, onSubmit, options = {}) {
    return HtmlForm(children, {
        onsubmit: (e) => {
            e.preventDefault();
            onSubmit(extractFormData(e.target.elements), e);
        },
        ...options
    });
}

function VisualComponent(component, ui) {
    return (store) => {
        const dispatch = (e) => renderComponent(ui(component(store, e), dispatch))
        renderComponent(ui(
            component(store, INIT),
            dispatch
        ));
    };
}


function renderComponent(component) {
    const el = render(component); // <-- side-effect

    const container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.append(el);
}

const extractFormData = (elements) =>
    Array.from(elements)
        .filter(e => !!e.name)
        .map(e => ({ [e.name]: e.value }))
        .reduce((ac, e) => ({ ...ac, ...e }));

function render(element) {
    const el = document.createElement(element.tagName);
    for (const prop in element.options) {
        if (!element.options.hasOwnProperty(prop)) continue;
        if (prop.toLowerCase().startsWith('on')) {
            el.addEventListener(prop.substr(2), element.options[prop]);
        } else {
            el.setAttribute(prop, element.options[prop]);
        }
    }
    element.children.forEach(c => {
        if (typeof c === 'string') el.append(c);
        else el.append(render(c));
    });
    return el;
}

function routeTo(path) {
    window.history.pushState(null, null, path);
}

function createElement(tagName) {
    return function (children, options) {
        return {
            tagName,
            children,
            options
        };
    };
}