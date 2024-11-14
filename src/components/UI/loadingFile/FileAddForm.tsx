import React, { ChangeEvent } from 'react';

interface FileAddFormType {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    fileName: string,
    description?: string,
}

const FileAddForm = ({
    onChange,
    fileName,
    description
}: FileAddFormType) => {
    
    return (
        <div className="upload-modal-form__upload-block">
            <div className="file-upload-animation-part">
                <input 
                    className="file-upload-animation-part__input"
                    id="js-file-input"
                    type="file"
                    onChange={onChange}
                />

                <div className="file-upload-animation-part__content">
                    <div className="file-upload-animation-part__infos">
                        <p className="file-upload-animation-part__icon">
                            <svg />
                            <span className="file-upload-animation-part__icon-shadow"></span>
                            <span className="file-upload-animation-part__text">Кликните для выбора файла <br /> или <br /> перенесите его сюда</span>
                            {description && <span className="file-upload-animation-part__text"><br />{description}</span>}
                        </p>
                    </div>
                    <p className="file-upload-animation-part__name" id="js-file-name">{fileName}</p>
                </div>
            </div>
        </div>
    );
};

export default FileAddForm;