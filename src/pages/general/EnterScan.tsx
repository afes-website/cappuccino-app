import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import { CheckCircle, Edit, Error, Replay } from "@material-ui/icons";
import { QrCodeScanner } from "@/components/MaterialSvgIcons";
import { Alert } from "@material-ui/lab";
import QRScanner from "@/components/QRScanner.";
import DirectInputModal from "@/components/DirectInputModal";
import DirectInputFab from "@/components/DirectInputFab";
import { useTitleSet } from "@/libs/title";
import api from "@afes-website/docs";
import aspida from "@aspida/axios";
import { AuthContext } from "@/libs/auth";
import isAxiosError from "@/libs/isAxiosError";

const useStyles = makeStyles({
  root: {
    padding: "10px",
  },
  noPadding: {
    padding: "0 !important",
    objectFit: "cover",
  },
  guestId: {
    display: "inline-block",
    marginBottom: "10px",
  },
  stepper: {
    padding: "12px 18px 6px 18px",
  },
  step: {
    padding: 0,
  },
  snackBar: {
    bottom: "64px",
  },
  statusIcon: {
    display: "block",
    width: "20%",
    height: "100%",
    margin: "0 auto",
    marginBottom: "10px",
  },
  bottomButton: {
    marginTop: "10px",
    width: "100%",
  },
});

const EnterScan: React.FC = () => {
  const classes = useStyles();
  const [latestRsvId, setLatestRsvId] = useState("");
  const [latestGuestId, setLatestGuestId] = useState("");
  const [opensRsvInputModal, setOpensRsvInputModal] = useState(false);
  const [opensGuestInputModal, setOpensGuestInputModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errorStatusCode, setErrorStatusCode] = useState<StatusCode | null>(
    null
  );
  const [isSuccess, setIsSuccess] = useState(false);
  useTitleSet("入場処理");
  const auth = useContext(AuthContext);

  const handleRsvIdScan = (rsvId: string | null) => {
    if (rsvId && latestRsvId !== rsvId) {
      setLatestRsvId(rsvId);
      if (latestGuestId === "") {
        api(aspida())
          .onsite.reservation._id(rsvId)
          .check.$get({
            headers: {
              Authorization: "bearer " + auth.val.get_current_user()?.token,
            },
          })
          .then((res) => {
            if (res.valid) {
              setErrorStatusCode(null);
              setActiveStep((s) => ++s);
            } else if (
              res.status_code &&
              (statusCodeList as ReadonlyArray<string>).includes(
                res.status_code
              )
            ) {
              setErrorStatusCode(res.status_code as StatusCode);
            }
          })
          .catch((e) => {
            if (isAxiosError(e) && e.response?.status === 404)
              setErrorStatusCode("RESERVATION_NOT_FOUND");
          });
      } else {
        post(rsvId, latestGuestId).finally(() => {
          setActiveStep(2);
        });
      }
    }
  };

  const handleGuestIdScan = (guestId: string | null) => {
    if (guestId && guestId !== latestGuestId && guestId !== latestRsvId) {
      setLatestGuestId(guestId);
      post(latestRsvId, guestId).finally(() => {
        setActiveStep(2);
      });
    }
  };

  const post = (rsvId: string, guestId: string): Promise<void> => {
    return api(aspida())
      .onsite.general.enter.$post({
        body: {
          reservation_id: rsvId,
          guest_id: guestId,
        },
        headers: {
          Authorization: "bearer " + auth.val.get_current_user()?.token,
        },
      })
      .then(() => {
        setIsSuccess(true);
        setErrorStatusCode(null);
      })
      .catch((e) => {
        setIsSuccess(false);
        if (
          isAxiosError(e) &&
          typeof e.response?.data.error_code === "string"
        ) {
          setErrorStatusCode(e.response?.data.error_code);
        }
      });
  };

  const getCurrentPageElement = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Card>
              <CardContent className={classes.noPadding}>
                <QRScanner onScanFunc={handleRsvIdScan} videoStop={false} />
              </CardContent>
            </Card>
          </>
        );
      case 1:
        return (
          <>
            <Card>
              <CardContent className={classes.noPadding}>
                <QRScanner onScanFunc={handleGuestIdScan} videoStop={false} />
              </CardContent>
            </Card>
          </>
        );
      case 2:
        return (
          <>
            <ResultIcon success={isSuccess} />
          </>
        );
    }
  };

  return (
    <div className={classes.root}>
      {/* Stepper */}
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className={classes.stepper}
      >
        {["予約確認", "リストバンド", "処理実行"].map((label) => (
          <Step className={classes.step} key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* メイン */}
      {getCurrentPageElement()}

      {/* Error Alert */}
      {errorStatusCode && (
        <Card>
          <CardContent className={classes.noPadding}>
            <Alert severity="error" variant="filled">
              {getErrorMessage(errorStatusCode)}
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* ID List */}
      <Card>
        <CardContent className={classes.noPadding}>
          <List>
            <ListItem>
              <ListItemText
                primary={latestRsvId ? latestRsvId : "-"}
                secondary="予約 ID"
              />
              {activeStep > 0 && (
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      setActiveStep(0);
                    }}
                  >
                    <QrCodeScanner />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpensRsvInputModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
            <ListItem>
              <ListItemText
                primary={latestGuestId ? latestGuestId : "-"}
                secondary="ゲスト ID (リストバンド ID)"
              />
              {activeStep > 1 && (
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      setActiveStep(1);
                    }}
                  >
                    <QrCodeScanner />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpensGuestInputModal(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* 直接入力するボタン */}
      {(activeStep === 0 || activeStep === 1) && (
        <DirectInputFab
          onClick={() => {
            switch (activeStep) {
              case 0:
                setOpensRsvInputModal(true);
                break;
              case 1:
                setOpensGuestInputModal(true);
                break;
            }
          }}
        />
      )}

      {/* 最初からやり直すボタン */}
      {activeStep === 2 && (
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            setLatestRsvId("");
            setLatestGuestId("");
            setActiveStep(0);
          }}
          startIcon={<Replay />}
          className={classes.bottomButton}
        >
          最初からやり直す
        </Button>
      )}

      {/* modal */}
      <DirectInputModal
        open={opensRsvInputModal}
        setOpen={setOpensRsvInputModal}
        onIdChange={handleRsvIdScan}
        currentId={latestRsvId}
        type="rsv"
      />
      <DirectInputModal
        open={opensGuestInputModal}
        setOpen={setOpensGuestInputModal}
        onIdChange={handleGuestIdScan}
        currentId={latestGuestId}
        type="guest"
      />
    </div>
  );
};

const ResultIcon: React.FC<{
  success: boolean;
}> = (props) => {
  const classes = useStyles();
  return props.success ? (
    <Card>
      <CardContent>
        <CheckCircle color="primary" className={classes.statusIcon} />
        <Typography variant="h6" align="center" color="primary">
          入場処理が完了しました
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardContent>
        <Error color="error" className={classes.statusIcon} />
        <Typography variant="h6" align="center" color="error">
          入場処理に失敗しました
        </Typography>
      </CardContent>
    </Card>
  );
};

const getErrorMessage = (status_code: StatusCode): string => {
  switch (status_code) {
    case "INVALID_WRISTBAND_CODE":
      return "リストバンド ID の形式が間違っています。別のリストバンドを試してください。";
    case "ALREADY_USED_WRISTBAND":
      return "このリストバンドはすでに登録済みです。別のリストバンドを試してください。";
    case "RESERVATION_NOT_FOUND":
      return "該当する予約が見つかりませんでした。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "INVALID_RESERVATION_INFO":
      return "予約情報に問題があります。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "ALREADY_ENTERED_RESERVATION":
      return "この予約はすでに入場済みです。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "OUT_OF_RESERVATION_TIME":
      return "この予約は入場時間外です。予約 ID を再確認し、権限の強い人を呼んでください。";
    case "WRONG_WRISTBAND_COLOR":
      return "リストバンドの色と退場予定時間が一致しません。リストバンドの種類をもう一度確認してください。";
  }
};

const statusCodeList = [
  "INVALID_WRISTBAND_CODE",
  "ALREADY_USED_WRISTBAND",
  "RESERVATION_NOT_FOUND",
  "INVALID_RESERVATION_INFO",
  "ALREADY_ENTERED_RESERVATION",
  "OUT_OF_RESERVATION_TIME",
  "WRONG_WRISTBAND_COLOR",
] as const;

type StatusCode = typeof statusCodeList[number];

export default EnterScan;
