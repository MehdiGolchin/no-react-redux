const Div = createElement('div');
const HtmlButton = createElement('button');
const Article = createElement('article');
const Header = createElement('header');
const Main = createElement('main');
const Footer = createElement('footer');
const H4 = createElement('h4');
const Input = createElement('input');
const HtmlForm = createElement('form');

function includeParams(fn, ...args) {
    return function () {
        fn.apply(this, Array.from(arguments).concat(args));
    }
}

function Button(children, options, dispatch, ...args) {
    return HtmlButton(children, {
        ...options,
        onclick: () => dispatch.apply(this, args)
    });
}

function Form(children, options, dispatch, ...args) {
    return HtmlForm(children, {
        ...options,
        onsubmit: (e) => {
            dispatch.apply(this, args.concat(extractFormData(e.target.elements)));
            e.preventDefault();
        }
    });
}

const extractFormData = (elements) =>
    Array.from(elements)
        .filter(e => !!e.name)
        .map(e => ({ [e.name]: e.value }))
        .reduce((ac, e) => ({ ...ac, ...e }));

function render(content) {
    const container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.append(content);
}

function createElement(tagName) {
    return function (children, options) {
        const el = document.createElement(tagName);
        for (const prop in options) {
            if (!options.hasOwnProperty(prop)) continue;
            if (prop.toLowerCase().startsWith('on')) {
                el.addEventListener(prop.substr(2), options[prop]);
            } else {
                el.setAttribute(prop, options[prop]);
            }
        }
        children.forEach(c => {
            if (typeof c === 'string') el.append(c);
            else el.append(c);
        });
        return el;
    };
}