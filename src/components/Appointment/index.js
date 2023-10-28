import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";

import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const MODES = {
  EMPTY: "EMPTY",
  SHOW: "SHOW",
  CREATE: "CREATE",
  EDIT: "EDIT",
  SAVING: "SAVING",
  DELETING: "DELETING",
  CONFIRM: "CONFIRM",
  ERROR_SAVE: "ERROR_SAVE",
  ERROR_DELETE: "ERROR_DELETE",
};

export default function Appointment(props) {

  const { interview, interviewers } = props;

  const { mode, transition, back } = useVisualMode(props.interview ? MODES.SHOW : MODES.EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(MODES.SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(MODES.SHOW))
      .catch(error => transition(MODES.ERROR_SAVE, true));
  }

  function destroy() {
    transition(MODES.DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(MODES.EMPTY))
      .catch(error => transition(MODES.ERROR_DELETE, true));
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === MODES.EMPTY && (
        <Empty onAdd={() => transition(MODES.CREATE)} />
      )}
      {mode === MODES.SHOW && (
        <Show student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => transition(MODES.CONFIRM)}
          onEdit={() => transition(MODES.EDIT)}
        />
      )}

      {mode === MODES.CREATE && (
        <Form interviewers={interviewers} onCancel={back} onSave={save} />
      )}

      {mode === MODES.EDIT && (
        <Form
          name={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === MODES.SAVING && <Status message="Saving" />}
      {mode === MODES.DELETING && <Status message="Deleting" />}
      {mode === MODES.CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete?"
          onCancel={back}
          onConfirm={destroy}
        />
      )}
      {mode === MODES.ERROR_SAVE && (
        <Error message="Could not book appointment." onClose={back} />
      )}
      {mode === MODES.ERROR_DELETE && (
        <Error message="Could not cancel appointment." onClose={back} />
      )}

    </article>
  );
}


