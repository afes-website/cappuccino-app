/* eslint-disable @typescript-eslint/no-var-requires */
import markdownIt from "markdown-it";
import {
  containerDetailsOptions,
  containerMessageOptions,
} from "libs/md-container";

const mdBr = require("markdown-it-br");
const mdCjkBreaks = require("markdown-it-cjk-breaks");
const mdContainer = require("markdown-it-container");
const mdInlineComments = require("markdown-it-inline-comments");
const mdTaskLists = require("markdown-it-task-lists");

const md = markdownIt({ breaks: true, linkify: false });

md.use(mdBr)
  .use(mdCjkBreaks)
  .use(mdContainer, "details", containerDetailsOptions)
  .use(mdContainer, "message", containerMessageOptions)
  .use(mdInlineComments)
  .use(mdTaskLists);

const markdownToHtml = (markdown: string): string => {
  if (!markdown) return "";
  return md.render(markdown);
};

export default markdownToHtml;
