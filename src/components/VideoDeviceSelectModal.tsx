import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
} from "@material-ui/core";
import { useDeviceId } from "@/libs/videoDeviceId";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles(() =>
  createStyles({
    selectBox: {
      width: "100%",
    },
  })
);

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onChange: (deviceId: string) => void;
}

const CameraDeviceSelectModal: React.FC<Props> = (props) => {
  const classes = useStyles();

  const [deviceId, setDeviceId] = useDeviceId();
  const [_deviceId, _setDeviceId] = useState(deviceId);
  const [deviceList, setDeviceList] = useState<MediaDeviceInfo[] | null>(null);

  const handleClose = () => {
    props.setOpen(false);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((arr) => setDeviceList(arr));
  }, []);

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">映像入力デバイス選択</DialogTitle>
      <DialogContent>
        <DialogContentText>
          複数のレンズを搭載しているスマートフォンにおいて、カメラの表示がおかしくなることがあります。
        </DialogContentText>
        <DialogContentText>
          そのような場合のみ、デバイスを選択してください。
        </DialogContentText>
        {deviceList ? (
          <DialogContentText>
            <Select
              color="secondary"
              value={_deviceId}
              onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                _setDeviceId(event.target.value as string);
              }}
              className={classes.selectBox}
            >
              {deviceList
                .filter((info) => info.kind === "videoinput")
                .map(({ label, deviceId }) => (
                  <MenuItem key={deviceId} value={deviceId}>
                    {label || "(No name)"}
                  </MenuItem>
                ))}
            </Select>
          </DialogContentText>
        ) : (
          <DialogContentText>読込中 ...</DialogContentText>
        )}
        <DialogContentText>
          <Alert severity="info">
            切り替え後にカメラが読み込まれない場合は、再読み込みをお試しください。
          </Alert>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          キャンセル
        </Button>
        <Button
          onClick={() => {
            handleClose();
            setDeviceId(_deviceId);
            props.onChange(_deviceId);
          }}
          color="secondary"
        >
          決定
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CameraDeviceSelectModal;
