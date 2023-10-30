/*

import { Transition } from "react-transition-group";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallbackState, helper as $h } from "@/utils";

import Web3Sidebar from "@/views/components/web3-sidebar/Main.jsx";

import Header from "../views/partials/Header";
import Footer from "../views/partials/Footer";
import HeaderSidebar from "@/views/components/header-sidebar/Main.jsx";

import { Web3SidebarStore } from "@/stores/web3-side-bar.js";
import { Web3Store } from "@/stores/web3-store-mobx.js";

import { HeaderStore } from "@/stores/header-store-mobx";
import React from "react";

import Markdoc from "@markdoc/markdoc";

const sidebarStore = new Web3SidebarStore();
const web3Store = new Web3Store();
const headerStore = new HeaderStore();

//https://markdoc.dev/docs/examples/react

import { callout } from "./schema/callout.markdoc";
import { heading } from "./schema/heading.markdoc.js";

const doc = `
        ---
        title: What is Markdoc?
        ---

        # hihihi

        Lists
            - Item 1
            - Item 1
            - Item 1

            ## How is Markdoc different?

            Markdoc uses a fully declarative approach to composition and flow control, where other solutions… [Read more](/docs/overview).
        `;

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);

  const MarkdocComponent = ({ doc }) => {
    const ast = Markdoc.parse(doc);

    const config = {
      tags: {
        callout,
      },
      nodes: {
        heading,
      },
      variables: {},
    };

    const content = Markdoc.transform(ast, config);

    const components = {};

    console.log({ ast, content });
    const html = Markdoc.renderers.react(content, React, { components });

    return html;
  };

  return (
    <div className="bg-white relative">
     
      <Header
        headerStore={headerStore}
        sidebarStore={sidebarStore}
        web3Store={web3Store}
      />

      <div className="xl:hidden">
        <HeaderSidebar headerStore={headerStore} />
      </div>

      <Web3Sidebar
        sidebarStore={sidebarStore}
        web3Store={web3Store}
        slot={<div> </div>}
      />

      <div>
        <MarkdocComponent doc={doc} />
      </div>

     
      <Footer />
    </div>
  );
}

export default Main;



*/

import { Transition } from "react-transition-group";
import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCallbackState, helper as $h } from "@/utils";

import { linkTo, nestedMenu, enter, leave } from "./index";
import { Lucide } from "@/base-components";
import dom from "@left4code/tw-starter/dist/js/dom";
import SimpleBar from "simplebar";
import logoUrl from "@/assets/images/degenbro.png";
import classnames from "classnames";
import Web3Sidebar from "@/views/components/web3-sidebar/Main.jsx";

import Header from "../views/partials/Header";
import Footer from "../views/partials/Footer";
import HeaderSidebar from "@/views/components/header-sidebar/Main.jsx";

import { Web3SidebarStore } from "@/stores/web3-side-bar.js";
import { Web3Store } from "@/stores/web3-store-mobx.js";

import { HeaderStore } from "@/stores/header-store-mobx";

const sidebarStore = new Web3SidebarStore();
const web3Store = new Web3Store();
const headerStore = new HeaderStore();

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);

  return (
    <div className="bg-white relative">
      {/*  Site header */}
      <Header
        headerStore={headerStore}
        sidebarStore={sidebarStore}
        web3Store={web3Store}
      />

      <div className="xl:hidden">
        <HeaderSidebar headerStore={headerStore} />
      </div>

      <Web3Sidebar
        sidebarStore={sidebarStore}
        web3Store={web3Store}
        slot={<div> </div>}
      />

      <Outlet context={[web3Store, sidebarStore]} />

      {/*  Site footer */}
      <Footer />
    </div>
  );
}

export default Main;
