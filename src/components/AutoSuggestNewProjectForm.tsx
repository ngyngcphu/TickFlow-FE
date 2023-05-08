import { KeyboardEvent, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { AutoSuggestNewProject } from "@interfaces";

export function AutoSuggestNewProjectForm(props: AutoSuggestNewProject) {
  const [show, setShow] = useState<boolean>(false);

  const escapeRegexCharacters = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const getSuggestions = (value: string) => {
    const escapedValue = escapeRegexCharacters(value.trim());
    if (escapedValue === "") {
      return props.temp;
    }
    const regex = new RegExp("\\b" + escapedValue, "i");
    return props.temp.filter((member) => regex.test(getSuggestionValue(member)));
  };

  const getSuggestionValue = (suggestion: string) => suggestion;

  const renderSuggestion = (suggestion: string, { query }: { query: string }) => {
    const suggestionText = suggestion;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    return (
      <span>
        {parts.map((part, index) => {
          return (
            <span style={part.highlight ? { color: "#ee0000", fontWeight: "bold" } : {}} key={index}>
              {part.text}
            </span>
          );
        })}
      </span>
    );
  };

  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Array<string>>([]);

  const onChange = (event: React.FormEvent, { newValue }: Autosuggest.ChangeEvent) => {
    setValue(newValue);
  };

  const removeNameInTemp = (name: string) => {
    props.setTemp(props.temp.filter((i: string) => i !== name));
  };

  const handleChange = () => {
    if (value.trim() === "") return;
    if (props.temp.find((name: string) => name === value) === undefined) {
      setShow(true);
      setValue("");
      return;
    }
    if (props.id === "leaderName") {
      props.setProjectData((prev) => ({
        ...prev,
        leaderName: [...prev.leaderName, value]
      }));
    } else if (props.id === "memberName") {
      props.setProjectData((prev) => ({
        ...prev,
        memberName: [...prev.memberName, value]
      }));
    } else {
      props.setProjectData((prev) => ({
        ...prev,
        mentorName: [...prev.mentorName, value]
      }));
    }
    removeNameInTemp(value);
    setValue("");
  };

  const onBlur = () => {
    handleChange();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleChange();
    }
  };

  const onSuggestionsFetchRequested = ({ value }: Autosuggest.SuggestionsFetchRequestedParams) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    value,
    onChange,
    onBlur,
    onKeyDown
  };

  return (
    <>
      <Autosuggest
        id={props.id}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={() => true}
      />
      <Modal show={show} size='md' popup={true} onClose={() => setShow(false)}>
        <Modal.Body>
          <div className='text-center'>
            <ExclamationCircleIcon className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
            <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>Không tồn tại thành viên này!</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={() => setShow(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
