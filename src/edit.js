/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useState, useCallback, useEffect } from 'react';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
    const { lists = [], blockId } = attributes;
    const [ inputValue, setInputValue ] = useState( '' );
    const blockProps = useBlockProps();

    // Ensure a persistent unique id for this block instance
    useEffect( () => {
        if ( ! blockId ) {
            const id = `todo_${ Math.random().toString( 36 ).slice( 2 ) }_${ Date.now() }`;
            setAttributes( { blockId: id } );
        }
    }, [ blockId, setAttributes ] );

    const addItem = useCallback( () => {
        const value = inputValue.trim();
        if ( ! value ) return;
        const next = [ ...lists, { text: value, done: false } ];
        setAttributes( { lists: next } );
        setInputValue( '' );
    }, [ inputValue, lists, setAttributes ] );

    const removeItem = useCallback( ( index ) => {
        const next = lists.filter( ( _, i ) => i !== index );
        setAttributes( { lists: next } );
    }, [ lists, setAttributes ] );

    const toggleItem = useCallback( ( index ) => {
        const next = lists.map( ( item, i ) => i === index ? { ...item, done: ! item.done } : item );
        setAttributes( { lists: next } );
    }, [ lists, setAttributes ] );

    const onKeyDown = useCallback( ( e ) => {
        if ( e.key === 'Enter' ) {
            e.preventDefault();
            addItem();
        }
    }, [ addItem ] );

    return (
        <div { ...blockProps }>
            <div className="todo-controls">
                <input
                    type="text"
                    placeholder={ __( 'Add a todo…', 'my-todo-plugin' ) }
                    value={ inputValue }
                    onChange={ ( e ) => setInputValue( e.target.value ) }
                    onKeyDown={ onKeyDown }
                />
                <button onClick={ addItem }>{ __( 'Add', 'my-todo-plugin' ) }</button>
            </div>
            <ul className="todo-list">
                { lists.map( ( item, index ) => (
                    <li key={ index }>
                        <label>
                            <input
                                type="checkbox"
                                checked={ !! item.done }
                                onChange={ () => toggleItem( index ) }
                            />
                            <span>{ item.text }</span>
                        </label>
                        <button onClick={ () => removeItem( index ) }>
                            { __( 'Delete', 'my-todo-plugin' ) }
                        </button>
                    </li>
                ) ) }
            </ul>
        </div>
    );
}
