import React from "react";
import { Divider, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useTitleSet } from "libs/title";

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      padding: `${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
      "& *": {
        lineHeight: 1.9,
      },
      "& p": {
        marginTop: theme.spacing(1),
      },
      "& p + p": {
        marginTop: theme.spacing(2),
      },
      "& section + section": {
        marginTop: theme.spacing(4),
      },
      "& a": {
        wordBreak: "break-all",
      },
      "& ul": {
        paddingLeft: theme.spacing(3),
      },
    },
    divider: {
      margin: `${theme.spacing(1.5)}px 0`,
    },
  })
);

const Terms: React.VFC = () => {
  const classes = useStyles();
  useTitleSet("利用規約");

  return (
    <article className={classes.root}>
      <Typography variant="h6" align="center">
        利用規約 & プライバシーポリシー
      </Typography>
      <Divider className={classes.divider} />
      <section>
        <Typography variant="body2">
          第74回麻布学園文化祭実行委員会（以下「文実」とします。）は、「CAPPUCCINO」アプリ（以下「当アプリ」とします。）の提供に関し、以下のプライバシーポリシーを定め、個人情報保護法を遵守するとともに、利用者・来場者のプライバシーの保護に最大限配慮します。
        </Typography>
        <Typography variant="body2">
          また、当アプリ及び当アプリのコンテンツを利用する利用者は、以下の事項に全て同意するものとみなします。
        </Typography>
      </section>
      <section>
        <Typography variant="h6">1. JavaScript の使用について</Typography>
        <Typography variant="body2">
          当アプリでは、JavaScript
          を用いて情報を表示しています。これはお使いの端末でプログラムを実行しますが、大きな悪影響を及ぼすものではありません。
        </Typography>
        <Typography variant="body2">
          利用者は、当アプリを利用することで JavaScript
          の実行に許可を与えたものとみなします。
        </Typography>
        <Typography variant="body2">
          ブラウザで JavaScript
          を無効にすることで実行を拒否することができますが、無効にすると当アプリは正しく動作しない可能性があります。
        </Typography>
      </section>
      <section>
        <Typography variant="h6">
          2. Google Analytics 及び Cookie の使用について
        </Typography>
        <Typography variant="body2">
          当アプリでは、Google によるアクセス解析ツール「Google
          Analytics」を使用しています。これに伴い、データ収集のために Cookie
          を使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
        </Typography>
        <Typography variant="body2">
          利用者は、当アプリを利用することで Cookie
          の使用に許可を与えたものとみなします。
        </Typography>
        <Typography variant="body2">
          ブラウザで Cookie
          を無効にすることで収集を拒否することができますので、お使いのブラウザの設定をご確認ください。
        </Typography>
        <Typography variant="body2">
          Google Analytics の利用規約に関する説明については Google Analytics
          のサイトを、Google
          のプライバシーポリシーに関する説明については同社のサイトをご覧ください。
        </Typography>
        <ul>
          {analyticsLinks.map(({ title, url }) => (
            <li key={title}>
              <Typography variant="body2">
                {title}
                <br />
                <Link href={url} variant="body2" color="secondary">
                  {url}
                </Link>
              </Typography>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <Typography variant="h6">3. 本規約・ポリシーの改定について</Typography>
        <Typography variant="body2">
          文実は、本規約・ポリシーの内容を適宜見直し、その改善に努めます。
        </Typography>
        <Typography variant="body2">
          修正された最新の利用規約・プライバシーポリシーは常に本ページにて開示されます。
        </Typography>
      </section>
    </article>
  );
};

const analyticsLinks: { title: string; url: string }[] = [
  {
    title: "Google Analytics の利用規約",
    url: "https://www.google.com/analytics/terms/jp.html",
  },
  {
    title:
      "Google のサービスを使用するサイトやアプリから収集した情報の Google による使用",
    url: "https://policies.google.com/technologies/partner-sites?hl=ja",
  },
  {
    title: "Google のプライバシーポリシー",
    url: "https://www.google.com/intl/ja/policies/privacy/",
  },
  {
    title: "Google Analytics オプトアウトアドオン",
    url: "https://tools.google.com/dlpage/gaoptout?hl=ja",
  },
];

export default Terms;
