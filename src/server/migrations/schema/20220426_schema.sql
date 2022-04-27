--
-- PostgreSQL database dump
--

-- Dumped from database version 10.9
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: noipm-db; Type: DATABASE; Schema: -; Owner: postgres
--

-- CREATE DATABASE "noipm-db" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


-- ALTER DATABASE "noipm-db" OWNER TO postgres;

-- \connect -reuse-previous=on "dbname='noipm-db'"

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

--
-- Name: enum_addresses_addressable_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_addresses_addressable_type AS ENUM (
    'cases',
    'civilian'
);


ALTER TYPE public.enum_addresses_addressable_type OWNER TO postgres;

--
-- Name: enum_cases_officers_employee_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_cases_officers_employee_type AS ENUM (
    'Commissioned',
    'Non-Commissioned',
    'Recruit'
);


ALTER TYPE public.enum_cases_officers_employee_type OWNER TO postgres;

--
-- Name: enum_cases_officers_role_on_case; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_cases_officers_role_on_case AS ENUM (
    'Accused',
    'Complainant',
    'Witness'
);


ALTER TYPE public.enum_cases_officers_role_on_case OWNER TO postgres;

--
-- Name: enum_cases_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_cases_status AS ENUM (
    'Initial',
    'Active',
    'Letter in Progress',
    'Ready for Review',
    'Forwarded to Agency',
    'Closed'
);


ALTER TYPE public.enum_cases_status OWNER TO postgres;

--
-- Name: enum_civilians_gender_identity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_civilians_gender_identity AS ENUM (
    'Male',
    'Female',
    'Trans Male',
    'Trans Female',
    'Other',
    'Unknown'
);


ALTER TYPE public.enum_civilians_gender_identity OWNER TO postgres;

--
-- Name: enum_civilians_role_on_case; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_civilians_role_on_case AS ENUM (
    'Complainant',
    'Witness'
);


ALTER TYPE public.enum_civilians_role_on_case OWNER TO postgres;

--
-- Name: enum_officers_allegations_severity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_officers_allegations_severity AS ENUM (
    'Low',
    'Medium',
    'High'
);


ALTER TYPE public.enum_officers_allegations_severity OWNER TO postgres;

--
-- Name: enum_officers_employee_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_officers_employee_type AS ENUM (
    'Commissioned',
    'Non-Commissioned',
    'Recruit'
);


ALTER TYPE public.enum_officers_employee_type OWNER TO postgres;

SET default_tablespace = '';

--
-- Name: action_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_audits (
    id integer NOT NULL,
    action character varying(255) NOT NULL,
    "user" character varying(255) NOT NULL,
    case_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    audit_type character varying(255) NOT NULL,
    subject character varying(255),
    audit_details jsonb
);


ALTER TABLE public.action_audits OWNER TO postgres;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    street_address character varying(255),
    street_address2 character varying(25),
    city character varying(255),
    state character varying(255),
    zip_code character varying(255),
    country character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    intersection character varying(255),
    deleted_at timestamp with time zone,
    addressable_type public.enum_addresses_addressable_type,
    addressable_id integer,
    lat double precision,
    lng double precision,
    place_id character varying(1023),
    additional_location_info character varying(255)
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.addresses_id_seq OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: allegations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.allegations (
    id integer NOT NULL,
    rule character varying(255),
    paragraph character varying(255),
    directive character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.allegations OWNER TO postgres;

--
-- Name: allegations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.allegations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.allegations_id_seq OWNER TO postgres;

--
-- Name: allegations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.allegations_id_seq OWNED BY public.allegations.id;


--
-- Name: attachments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attachments (
    id integer NOT NULL,
    case_id integer NOT NULL,
    file_name character varying(255) NOT NULL,
    description character varying(200) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.attachments OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attachments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.attachments_id_seq OWNER TO postgres;

--
-- Name: attachments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attachments_id_seq OWNED BY public.attachments.id;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.action_audits.id;


--
-- Name: audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audits (
    id integer NOT NULL,
    reference_id integer,
    audit_action character varying(255) NOT NULL,
    "user" character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    manager_type character varying(255) DEFAULT NULL::character varying NOT NULL
);


ALTER TABLE public.audits OWNER TO postgres;

--
-- Name: audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audits_id_seq OWNER TO postgres;

--
-- Name: audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audits_id_seq OWNED BY public.audits.id;


--
-- Name: case_classifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_classifications (
    id integer NOT NULL,
    case_id integer NOT NULL,
    classification_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.case_classifications OWNER TO postgres;

--
-- Name: case_classifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_classifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.case_classifications_id_seq OWNER TO postgres;

--
-- Name: case_classifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_classifications_id_seq OWNED BY public.case_classifications.id;


--
-- Name: case_note_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_note_actions (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.case_note_actions OWNER TO postgres;

--
-- Name: case_note_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_note_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.case_note_actions_id_seq OWNER TO postgres;

--
-- Name: case_note_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_note_actions_id_seq OWNED BY public.case_note_actions.id;


--
-- Name: case_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_notes (
    id integer NOT NULL,
    case_id integer NOT NULL,
    "user" character varying(255) NOT NULL,
    action character varying(255),
    action_taken_at timestamp with time zone NOT NULL,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    case_note_action_id integer
);


ALTER TABLE public.case_notes OWNER TO postgres;

--
-- Name: case_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.case_tags (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    case_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.case_tags OWNER TO postgres;

--
-- Name: case_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.case_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.case_tags_id_seq OWNER TO postgres;

--
-- Name: case_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.case_tags_id_seq OWNED BY public.case_tags.id;


--
-- Name: cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cases (
    id integer NOT NULL,
    status public.enum_cases_status DEFAULT 'Initial'::public.enum_cases_status NOT NULL,
    first_contact_date date DEFAULT '2019-10-04'::date NOT NULL,
    narrative_details text,
    created_by character varying(255) NOT NULL,
    assigned_to character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    narrative_summary character varying(500),
    incident_date date,
    incident_time time without time zone,
    district character varying(255),
    complaint_type text DEFAULT 'Civilian Initiated'::text NOT NULL,
    intake_source_id integer,
    deleted_at timestamp with time zone,
    year integer NOT NULL,
    case_number integer NOT NULL,
    pib_case_number character varying(25),
    how_did_you_hear_about_us_source_id integer,
    district_id integer
);


ALTER TABLE public.cases OWNER TO postgres;

--
-- Name: cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cases_id_seq OWNER TO postgres;

--
-- Name: cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cases_id_seq OWNED BY public.cases.id;


--
-- Name: cases_officers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cases_officers (
    id integer NOT NULL,
    case_id integer NOT NULL,
    officer_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    notes text,
    role_on_case public.enum_cases_officers_role_on_case,
    first_name character varying(255),
    middle_name character varying(255),
    last_name character varying(255),
    windows_username integer,
    supervisor_officer_number integer,
    supervisor_windows_username integer,
    supervisor_first_name character varying(255),
    supervisor_middle_name character varying(255),
    supervisor_last_name character varying(255),
    employee_type public.enum_cases_officers_employee_type,
    district character varying(255),
    bureau character varying(255),
    rank character varying(255),
    dob date,
    end_date date,
    hire_date date,
    sex character varying(255),
    race character varying(255),
    work_status character varying(255),
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false,
    case_employee_type character varying(255) DEFAULT 'Officer'::character varying NOT NULL,
    phone_number character varying(10),
    email character varying(100)
);


ALTER TABLE public.cases_officers OWNER TO postgres;

--
-- Name: cases_officers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cases_officers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cases_officers_id_seq OWNER TO postgres;

--
-- Name: cases_officers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cases_officers_id_seq OWNED BY public.cases_officers.id;


--
-- Name: civilian_titles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.civilian_titles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.civilian_titles OWNER TO postgres;

--
-- Name: civilian_titles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.civilian_titles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.civilian_titles_id_seq OWNER TO postgres;

--
-- Name: civilian_titles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.civilian_titles_id_seq OWNED BY public.civilian_titles.id;


--
-- Name: civilians; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.civilians (
    id integer NOT NULL,
    case_id integer,
    first_name character varying(25),
    middle_initial character varying(1),
    last_name character varying(25),
    suffix character varying(25),
    birth_date date,
    role_on_case public.enum_civilians_role_on_case,
    gender_identity public.enum_civilians_gender_identity,
    race_ethnicity character varying(255),
    phone_number character varying(10),
    email character varying(100),
    additional_info text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    title character varying(5),
    race_ethnicity_id integer,
    is_anonymous boolean DEFAULT false,
    gender_identity_id integer,
    civilian_title_id integer
);


ALTER TABLE public.civilians OWNER TO postgres;

--
-- Name: civilians_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.civilians_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.civilians_id_seq OWNER TO postgres;

--
-- Name: civilians_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.civilians_id_seq OWNED BY public.civilians.id;


--
-- Name: classifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.classifications (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    message text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.classifications OWNER TO postgres;

--
-- Name: complainant_letters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.complainant_letters (
    id integer NOT NULL,
    case_id integer NOT NULL,
    final_pdf_filename character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    complainant_civilian_id integer,
    complainant_officer_id integer
);


ALTER TABLE public.complainant_letters OWNER TO postgres;

--
-- Name: complainant_letters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.complainant_letters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.complainant_letters_id_seq OWNER TO postgres;

--
-- Name: complainant_letters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.complainant_letters_id_seq OWNED BY public.complainant_letters.id;


--
-- Name: data_access_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_access_audits (
    id integer NOT NULL,
    audit_id integer NOT NULL,
    audit_subject character varying(255) NOT NULL
);


ALTER TABLE public.data_access_audits OWNER TO postgres;

--
-- Name: data_access_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_access_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_access_audits_id_seq OWNER TO postgres;

--
-- Name: data_access_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_access_audits_id_seq OWNED BY public.data_access_audits.id;


--
-- Name: data_access_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_access_values (
    id integer NOT NULL,
    data_access_audit_id integer NOT NULL,
    association character varying(255) NOT NULL,
    fields jsonb NOT NULL
);


ALTER TABLE public.data_access_values OWNER TO postgres;

--
-- Name: data_access_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_access_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_access_values_id_seq OWNER TO postgres;

--
-- Name: data_access_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_access_values_id_seq OWNED BY public.data_access_values.id;


--
-- Name: data_change_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.data_change_audits (
    id integer NOT NULL,
    audit_id integer NOT NULL,
    model_name character varying(255) NOT NULL,
    model_description jsonb,
    model_id integer NOT NULL,
    snapshot jsonb NOT NULL,
    changes jsonb NOT NULL
);


ALTER TABLE public.data_change_audits OWNER TO postgres;

--
-- Name: legacy_data_change_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.legacy_data_change_audits (
    id integer NOT NULL,
    case_id integer,
    model_name character varying(255) NOT NULL,
    model_id integer NOT NULL,
    snapshot jsonb NOT NULL,
    action character varying(255) NOT NULL,
    changes jsonb NOT NULL,
    "user" character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    model_description jsonb
);


ALTER TABLE public.legacy_data_change_audits OWNER TO postgres;

--
-- Name: data_change_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_change_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_change_audits_id_seq OWNER TO postgres;

--
-- Name: data_change_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_change_audits_id_seq OWNED BY public.legacy_data_change_audits.id;


--
-- Name: data_change_audits_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.data_change_audits_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.data_change_audits_id_seq1 OWNER TO postgres;

--
-- Name: data_change_audits_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.data_change_audits_id_seq1 OWNED BY public.data_change_audits.id;


--
-- Name: districts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.districts (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.districts OWNER TO postgres;

--
-- Name: districts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.districts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.districts_id_seq OWNER TO postgres;

--
-- Name: districts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.districts_id_seq OWNED BY public.districts.id;


--
-- Name: export_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.export_audits (
    id integer NOT NULL,
    audit_id integer NOT NULL,
    export_type character varying(255) NOT NULL,
    range_type character varying(255),
    range_start character varying(255),
    range_end character varying(255)
);


ALTER TABLE public.export_audits OWNER TO postgres;

--
-- Name: export_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.export_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.export_audits_id_seq OWNER TO postgres;

--
-- Name: export_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.export_audits_id_seq OWNED BY public.export_audits.id;


--
-- Name: file_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file_audits (
    id integer NOT NULL,
    audit_id integer NOT NULL,
    file_type character varying(255) NOT NULL,
    file_name character varying(255)
);


ALTER TABLE public.file_audits OWNER TO postgres;

--
-- Name: file_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.file_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.file_audits_id_seq OWNER TO postgres;

--
-- Name: file_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.file_audits_id_seq OWNED BY public.file_audits.id;


--
-- Name: gender_identities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gender_identities (
    id integer NOT NULL,
    name character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.gender_identities OWNER TO postgres;

--
-- Name: gender_identities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gender_identities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gender_identities_id_seq OWNER TO postgres;

--
-- Name: gender_identities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gender_identities_id_seq OWNED BY public.gender_identities.id;


--
-- Name: how_did_you_hear_about_us_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.how_did_you_hear_about_us_sources (
    id integer NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.how_did_you_hear_about_us_sources OWNER TO postgres;

--
-- Name: how_did_you_hear_about_us_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.how_did_you_hear_about_us_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.how_did_you_hear_about_us_sources_id_seq OWNER TO postgres;

--
-- Name: how_did_you_hear_about_us_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.how_did_you_hear_about_us_sources_id_seq OWNED BY public.how_did_you_hear_about_us_sources.id;


--
-- Name: intake_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.intake_sources (
    id integer NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.intake_sources OWNER TO postgres;

--
-- Name: intake_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.intake_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.intake_sources_id_seq OWNER TO postgres;

--
-- Name: intake_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.intake_sources_id_seq OWNED BY public.intake_sources.id;


--
-- Name: legacy_data_access_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.legacy_data_access_audits (
    id integer NOT NULL,
    audit_id integer NOT NULL,
    audit_subject character varying(255) NOT NULL,
    audit_details jsonb NOT NULL
);


ALTER TABLE public.legacy_data_access_audits OWNER TO postgres;

--
-- Name: legacy_data_access_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.legacy_data_access_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.legacy_data_access_audits_id_seq OWNER TO postgres;

--
-- Name: legacy_data_access_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.legacy_data_access_audits_id_seq OWNED BY public.legacy_data_access_audits.id;


--
-- Name: letter_officers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.letter_officers (
    id integer NOT NULL,
    case_officer_id integer NOT NULL,
    num_historical_high_allegations integer,
    num_historical_med_allegations integer,
    num_historical_low_allegations integer,
    historical_behavior_notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    recommended_action_notes text,
    officer_history_option_id integer
);


ALTER TABLE public.letter_officers OWNER TO postgres;

--
-- Name: new_classifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.new_classifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.new_classifications_id_seq OWNER TO postgres;

--
-- Name: new_classifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.new_classifications_id_seq OWNED BY public.classifications.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    case_note_id integer NOT NULL,
    "user" character varying(255) NOT NULL,
    has_been_read boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: officer_history_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.officer_history_options (
    id integer NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.officer_history_options OWNER TO postgres;

--
-- Name: officer_history_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.officer_history_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.officer_history_options_id_seq OWNER TO postgres;

--
-- Name: officer_history_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.officer_history_options_id_seq OWNED BY public.officer_history_options.id;


--
-- Name: officers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.officers (
    id integer NOT NULL,
    officer_number integer NOT NULL,
    first_name character varying(255),
    middle_name character varying(255),
    last_name character varying(255),
    rank character varying(255),
    race character varying(255),
    sex character varying(255),
    dob date,
    bureau character varying(255),
    district character varying(255),
    work_status character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    supervisor_officer_number integer,
    hire_date date,
    end_date date,
    employee_type public.enum_officers_employee_type,
    windows_username integer,
    district_id integer
);


ALTER TABLE public.officers OWNER TO postgres;

--
-- Name: officers_allegations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.officers_allegations (
    id integer NOT NULL,
    details text NOT NULL,
    case_officer_id integer NOT NULL,
    allegation_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    severity public.enum_officers_allegations_severity NOT NULL
);


ALTER TABLE public.officers_allegations OWNER TO postgres;

--
-- Name: officers_allegations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.officers_allegations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.officers_allegations_id_seq OWNER TO postgres;

--
-- Name: officers_allegations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.officers_allegations_id_seq OWNED BY public.officers_allegations.id;


--
-- Name: officers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.officers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.officers_id_seq OWNER TO postgres;

--
-- Name: officers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.officers_id_seq OWNED BY public.officers.id;


--
-- Name: race_ethnicities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.race_ethnicities (
    id integer NOT NULL,
    name character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.race_ethnicities OWNER TO postgres;

--
-- Name: race_ethnicities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.race_ethnicities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.race_ethnicities_id_seq OWNER TO postgres;

--
-- Name: race_ethnicities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.race_ethnicities_id_seq OWNED BY public.race_ethnicities.id;


--
-- Name: recommended_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommended_actions (
    id integer NOT NULL,
    description character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.recommended_actions OWNER TO postgres;

--
-- Name: recommended_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recommended_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recommended_actions_id_seq OWNER TO postgres;

--
-- Name: recommended_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recommended_actions_id_seq OWNED BY public.recommended_actions.id;


--
-- Name: referral_letter_officer_history_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_letter_officer_history_notes (
    id integer NOT NULL,
    referral_letter_officer_id integer NOT NULL,
    pib_case_number character varying(255),
    details text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.referral_letter_officer_history_notes OWNER TO postgres;

--
-- Name: referral_letter_officer_history_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referral_letter_officer_history_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.referral_letter_officer_history_notes_id_seq OWNER TO postgres;

--
-- Name: referral_letter_officer_history_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referral_letter_officer_history_notes_id_seq OWNED BY public.referral_letter_officer_history_notes.id;


--
-- Name: referral_letter_officer_recommended_actions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_letter_officer_recommended_actions (
    id integer NOT NULL,
    referral_letter_officer_id integer NOT NULL,
    recommended_action_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE public.referral_letter_officer_recommended_actions OWNER TO postgres;

--
-- Name: referral_letter_officer_recommended_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referral_letter_officer_recommended_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.referral_letter_officer_recommended_actions_id_seq OWNER TO postgres;

--
-- Name: referral_letter_officer_recommended_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referral_letter_officer_recommended_actions_id_seq OWNED BY public.referral_letter_officer_recommended_actions.id;


--
-- Name: referral_letter_officers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referral_letter_officers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.referral_letter_officers_id_seq OWNER TO postgres;

--
-- Name: referral_letter_officers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referral_letter_officers_id_seq OWNED BY public.letter_officers.id;


--
-- Name: referral_letters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_letters (
    id integer NOT NULL,
    case_id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    include_retaliation_concerns boolean,
    recipient text,
    sender text,
    transcribed_by character varying(255),
    edited_letter_html text,
    final_pdf_filename character varying(255),
    recipient_address text
);


ALTER TABLE public.referral_letters OWNER TO postgres;

--
-- Name: referral_letters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.referral_letters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.referral_letters_id_seq OWNER TO postgres;

--
-- Name: referral_letters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.referral_letters_id_seq OWNED BY public.referral_letters.id;


--
-- Name: sequelize_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sequelize_data (
    name character varying(255) NOT NULL
);


ALTER TABLE public.sequelize_data OWNER TO postgres;

--
-- Name: sequelize_meta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sequelize_meta (
    name character varying(255) NOT NULL
);


ALTER TABLE public.sequelize_meta OWNER TO postgres;

--
-- Name: sortable_cases_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sortable_cases_view AS
SELECT
    NULL::integer AS id,
    NULL::text[] COLLATE pg_catalog."C" AS tag_names,
    NULL::text AS complaint_type,
    NULL::integer AS case_number,
    NULL::integer AS year,
    NULL::public.enum_cases_status AS status,
    NULL::date AS first_contact_date,
    NULL::character varying(255) AS assigned_to,
    NULL::timestamp with time zone AS deleted_at,
    NULL::json AS accused_officers,
    NULL::character varying AS complainant_first_name,
    NULL::character varying AS complainant_middle_name,
    NULL::character varying AS complainant_last_name,
    NULL::character varying AS complainant_suffix,
    NULL::text AS complainant_person_type,
    NULL::boolean AS complainant_is_anonymous;


ALTER TABLE public.sortable_cases_view OWNER TO postgres;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL COLLATE pg_catalog."C",
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: user_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_actions_id_seq OWNER TO postgres;

--
-- Name: user_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_actions_id_seq OWNED BY public.case_notes.id;


--
-- Name: action_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_audits ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: allegations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allegations ALTER COLUMN id SET DEFAULT nextval('public.allegations_id_seq'::regclass);


--
-- Name: attachments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments ALTER COLUMN id SET DEFAULT nextval('public.attachments_id_seq'::regclass);


--
-- Name: audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits ALTER COLUMN id SET DEFAULT nextval('public.audits_id_seq'::regclass);


--
-- Name: case_classifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_classifications ALTER COLUMN id SET DEFAULT nextval('public.case_classifications_id_seq'::regclass);


--
-- Name: case_note_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_note_actions ALTER COLUMN id SET DEFAULT nextval('public.case_note_actions_id_seq'::regclass);


--
-- Name: case_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_notes ALTER COLUMN id SET DEFAULT nextval('public.user_actions_id_seq'::regclass);


--
-- Name: case_tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_tags ALTER COLUMN id SET DEFAULT nextval('public.case_tags_id_seq'::regclass);


--
-- Name: cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases ALTER COLUMN id SET DEFAULT nextval('public.cases_id_seq'::regclass);


--
-- Name: cases_officers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases_officers ALTER COLUMN id SET DEFAULT nextval('public.cases_officers_id_seq'::regclass);


--
-- Name: civilian_titles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilian_titles ALTER COLUMN id SET DEFAULT nextval('public.civilian_titles_id_seq'::regclass);


--
-- Name: civilians id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilians ALTER COLUMN id SET DEFAULT nextval('public.civilians_id_seq'::regclass);


--
-- Name: classifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classifications ALTER COLUMN id SET DEFAULT nextval('public.new_classifications_id_seq'::regclass);


--
-- Name: complainant_letters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complainant_letters ALTER COLUMN id SET DEFAULT nextval('public.complainant_letters_id_seq'::regclass);


--
-- Name: data_access_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_access_audits ALTER COLUMN id SET DEFAULT nextval('public.data_access_audits_id_seq'::regclass);


--
-- Name: data_access_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_access_values ALTER COLUMN id SET DEFAULT nextval('public.data_access_values_id_seq'::regclass);


--
-- Name: data_change_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_change_audits ALTER COLUMN id SET DEFAULT nextval('public.data_change_audits_id_seq1'::regclass);


--
-- Name: districts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts ALTER COLUMN id SET DEFAULT nextval('public.districts_id_seq'::regclass);


--
-- Name: export_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_audits ALTER COLUMN id SET DEFAULT nextval('public.export_audits_id_seq'::regclass);


--
-- Name: file_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_audits ALTER COLUMN id SET DEFAULT nextval('public.file_audits_id_seq'::regclass);


--
-- Name: gender_identities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender_identities ALTER COLUMN id SET DEFAULT nextval('public.gender_identities_id_seq'::regclass);


--
-- Name: how_did_you_hear_about_us_sources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.how_did_you_hear_about_us_sources ALTER COLUMN id SET DEFAULT nextval('public.how_did_you_hear_about_us_sources_id_seq'::regclass);


--
-- Name: intake_sources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intake_sources ALTER COLUMN id SET DEFAULT nextval('public.intake_sources_id_seq'::regclass);


--
-- Name: legacy_data_access_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legacy_data_access_audits ALTER COLUMN id SET DEFAULT nextval('public.legacy_data_access_audits_id_seq'::regclass);


--
-- Name: legacy_data_change_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legacy_data_change_audits ALTER COLUMN id SET DEFAULT nextval('public.data_change_audits_id_seq'::regclass);


--
-- Name: letter_officers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letter_officers ALTER COLUMN id SET DEFAULT nextval('public.referral_letter_officers_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: officer_history_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officer_history_options ALTER COLUMN id SET DEFAULT nextval('public.officer_history_options_id_seq'::regclass);


--
-- Name: officers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers ALTER COLUMN id SET DEFAULT nextval('public.officers_id_seq'::regclass);


--
-- Name: officers_allegations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers_allegations ALTER COLUMN id SET DEFAULT nextval('public.officers_allegations_id_seq'::regclass);


--
-- Name: race_ethnicities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.race_ethnicities ALTER COLUMN id SET DEFAULT nextval('public.race_ethnicities_id_seq'::regclass);


--
-- Name: recommended_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommended_actions ALTER COLUMN id SET DEFAULT nextval('public.recommended_actions_id_seq'::regclass);


--
-- Name: referral_letter_officer_history_notes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_history_notes ALTER COLUMN id SET DEFAULT nextval('public.referral_letter_officer_history_notes_id_seq'::regclass);


--
-- Name: referral_letter_officer_recommended_actions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_recommended_actions ALTER COLUMN id SET DEFAULT nextval('public.referral_letter_officer_recommended_actions_id_seq'::regclass);


--
-- Name: referral_letters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letters ALTER COLUMN id SET DEFAULT nextval('public.referral_letters_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: allegations allegations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.allegations
    ADD CONSTRAINT allegations_pkey PRIMARY KEY (id);


--
-- Name: attachments attachments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_pkey PRIMARY KEY (id);


--
-- Name: action_audits audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_audits
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: audits audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_pkey PRIMARY KEY (id);


--
-- Name: case_classifications case_classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_classifications
    ADD CONSTRAINT case_classifications_pkey PRIMARY KEY (id);


--
-- Name: case_note_actions case_note_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_note_actions
    ADD CONSTRAINT case_note_actions_pkey PRIMARY KEY (id);


--
-- Name: case_tags case_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_tags
    ADD CONSTRAINT case_tags_pkey PRIMARY KEY (id);


--
-- Name: cases_officers cases_officers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases_officers
    ADD CONSTRAINT cases_officers_pkey PRIMARY KEY (id);


--
-- Name: cases cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_pkey PRIMARY KEY (id);


--
-- Name: cases cases_unique_reference_number; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_unique_reference_number UNIQUE (year, case_number);


--
-- Name: civilian_titles civilian_titles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilian_titles
    ADD CONSTRAINT civilian_titles_pkey PRIMARY KEY (id);


--
-- Name: civilians civilians_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilians
    ADD CONSTRAINT civilians_pkey PRIMARY KEY (id);


--
-- Name: complainant_letters complainant_letters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complainant_letters
    ADD CONSTRAINT complainant_letters_pkey PRIMARY KEY (id);


--
-- Name: data_access_audits data_access_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_access_audits
    ADD CONSTRAINT data_access_audits_pkey PRIMARY KEY (id);


--
-- Name: data_access_values data_access_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_access_values
    ADD CONSTRAINT data_access_values_pkey PRIMARY KEY (id);


--
-- Name: legacy_data_change_audits data_change_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legacy_data_change_audits
    ADD CONSTRAINT data_change_audits_pkey PRIMARY KEY (id);


--
-- Name: data_change_audits data_change_audits_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_change_audits
    ADD CONSTRAINT data_change_audits_pkey1 PRIMARY KEY (id);


--
-- Name: districts districts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.districts
    ADD CONSTRAINT districts_pkey PRIMARY KEY (id);


--
-- Name: export_audits export_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_audits
    ADD CONSTRAINT export_audits_pkey PRIMARY KEY (id);


--
-- Name: file_audits file_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_audits
    ADD CONSTRAINT file_audits_pkey PRIMARY KEY (id);


--
-- Name: gender_identities gender_identities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gender_identities
    ADD CONSTRAINT gender_identities_pkey PRIMARY KEY (id);


--
-- Name: how_did_you_hear_about_us_sources how_did_you_hear_about_us_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.how_did_you_hear_about_us_sources
    ADD CONSTRAINT how_did_you_hear_about_us_sources_pkey PRIMARY KEY (id);


--
-- Name: intake_sources intake_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.intake_sources
    ADD CONSTRAINT intake_sources_pkey PRIMARY KEY (id);


--
-- Name: legacy_data_access_audits legacy_data_access_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legacy_data_access_audits
    ADD CONSTRAINT legacy_data_access_audits_pkey PRIMARY KEY (id);


--
-- Name: classifications new_classifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.classifications
    ADD CONSTRAINT new_classifications_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: officer_history_options officer_history_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officer_history_options
    ADD CONSTRAINT officer_history_options_pkey PRIMARY KEY (id);


--
-- Name: officers_allegations officers_allegations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers_allegations
    ADD CONSTRAINT officers_allegations_pkey PRIMARY KEY (id);


--
-- Name: officers officers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_pkey PRIMARY KEY (id);


--
-- Name: race_ethnicities race_ethnicities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.race_ethnicities
    ADD CONSTRAINT race_ethnicities_pkey PRIMARY KEY (id);


--
-- Name: recommended_actions recommended_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommended_actions
    ADD CONSTRAINT recommended_actions_pkey PRIMARY KEY (id);


--
-- Name: referral_letter_officer_history_notes referral_letter_officer_history_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_history_notes
    ADD CONSTRAINT referral_letter_officer_history_notes_pkey PRIMARY KEY (id);


--
-- Name: referral_letter_officer_recommended_actions referral_letter_officer_recommended_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_recommended_actions
    ADD CONSTRAINT referral_letter_officer_recommended_actions_pkey PRIMARY KEY (id);


--
-- Name: referral_letter_officer_recommended_actions referral_letter_officer_recommended_actions_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_recommended_actions
    ADD CONSTRAINT referral_letter_officer_recommended_actions_unique UNIQUE (referral_letter_officer_id, recommended_action_id, deleted_at);


--
-- Name: letter_officers referral_letter_officers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letter_officers
    ADD CONSTRAINT referral_letter_officers_pkey PRIMARY KEY (id);


--
-- Name: referral_letters referral_letters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letters
    ADD CONSTRAINT referral_letters_pkey PRIMARY KEY (id);


--
-- Name: sequelize_data sequelize_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sequelize_data
    ADD CONSTRAINT sequelize_data_pkey PRIMARY KEY (name);


--
-- Name: sequelize_meta sequelize_meta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sequelize_meta
    ADD CONSTRAINT sequelize_meta_pkey PRIMARY KEY (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: cases_officers unique-case-officer-pair; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases_officers
    ADD CONSTRAINT "unique-case-officer-pair" UNIQUE (case_id, officer_id, deleted_at);


--
-- Name: officers uniqueOfficerNumber; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT "uniqueOfficerNumber" UNIQUE (officer_number);


--
-- Name: case_notes user_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_notes
    ADD CONSTRAINT user_actions_pkey PRIMARY KEY (id);


--
-- Name: sortable_cases_view _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.sortable_cases_view AS
 SELECT cases.id,
    array_agg((tagdetails.name)::text ORDER BY (upper((tagdetails.name)::text))) AS tag_names,
    cases.complaint_type,
    cases.case_number,
    cases.year,
    cases.status,
    cases.first_contact_date,
    cases.assigned_to,
    cases.deleted_at,
    json_agg(accused_officers.* ORDER BY accused_officers.accused_last_name, accused_officers.accused_first_name, accused_officers.accused_middle_name) AS accused_officers,
    primary_complainant.complainant_first_name,
    primary_complainant.complainant_middle_name,
    primary_complainant.complainant_last_name,
    primary_complainant.complainant_suffix,
    primary_complainant.complainant_person_type,
    primary_complainant.complainant_is_anonymous
   FROM ((((public.cases
     LEFT JOIN ( SELECT officers.case_id,
            officers.id AS case_officer_id,
                CASE
                    WHEN ((officers.case_employee_type)::text = 'Civilian Within NOPD'::text) THEN 'Civilian (NOPD)'::text
                    WHEN (officers.officer_id IS NULL) THEN 'Unknown Officer'::text
                    ELSE 'Known Officer'::text
                END AS accused_person_type,
            officers.officer_id AS accused_officer_id,
            officers.first_name AS accused_first_name,
            officers.middle_name AS accused_middle_name,
            officers.last_name AS accused_last_name
           FROM public.cases_officers officers
          WHERE ((officers.role_on_case = 'Accused'::public.enum_cases_officers_role_on_case) AND (officers.deleted_at IS NULL))) accused_officers ON ((cases.id = accused_officers.case_id)))
     LEFT JOIN ( SELECT c.case_id,
            c.first_name AS complainant_first_name,
            c.middle_name AS complainant_middle_name,
            c.last_name AS complainant_last_name,
            c.suffix AS complainant_suffix,
            c.complainant_person_type,
            c.is_anonymous AS complainant_is_anonymous
           FROM ( SELECT c_1.case_id,
                    c_1.first_name,
                    c_1.middle_initial AS middle_name,
                    c_1.last_name,
                    c_1.suffix,
                    'Civilian'::text AS complainant_person_type,
                    c_1.is_anonymous,
                    c_1.created_at
                   FROM public.civilians c_1
                  WHERE ((c_1.role_on_case = 'Complainant'::public.enum_civilians_role_on_case) AND (c_1.deleted_at IS NULL))
                UNION ALL
                 SELECT co.case_id,
                    co.first_name,
                    co.middle_name,
                    co.last_name,
                    NULL::character varying AS suffix,
                        CASE
                            WHEN ((co.case_employee_type)::text = 'Civilian Within NOPD'::text) THEN 'Civilian (NOPD)'::text
                            WHEN (co.officer_id IS NULL) THEN 'Unknown Officer'::text
                            ELSE 'Known Officer'::text
                        END AS complainant_person_type,
                    co.is_anonymous,
                    co.created_at
                   FROM public.cases_officers co
                  WHERE ((co.role_on_case = 'Complainant'::public.enum_cases_officers_role_on_case) AND (co.deleted_at IS NULL))) c
          WHERE (c.created_at = ( SELECT min(cc.created_at) AS created_at
                   FROM ( SELECT c_1.case_id,
                            c_1.created_at
                           FROM public.civilians c_1
                          WHERE ((c_1.role_on_case = 'Complainant'::public.enum_civilians_role_on_case) AND (c_1.deleted_at IS NULL))
                        UNION ALL
                         SELECT co.case_id,
                            co.created_at
                           FROM public.cases_officers co
                          WHERE ((co.role_on_case = 'Complainant'::public.enum_cases_officers_role_on_case) AND (co.deleted_at IS NULL))) cc
                  WHERE (cc.case_id = c.case_id)))) primary_complainant ON ((cases.id = primary_complainant.case_id)))
     LEFT JOIN ( SELECT case_tags.case_id,
            case_tags.tag_id
           FROM public.case_tags) casetags ON ((cases.id = casetags.case_id)))
     LEFT JOIN ( SELECT tags.id,
            tags.name
           FROM public.tags) tagdetails ON ((tagdetails.id = casetags.tag_id)))
  GROUP BY cases.id, primary_complainant.complainant_first_name, primary_complainant.complainant_middle_name, primary_complainant.complainant_last_name, primary_complainant.complainant_suffix, primary_complainant.complainant_person_type, primary_complainant.complainant_is_anonymous;


--
-- Name: attachments attachments_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attachments
    ADD CONSTRAINT attachments_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: action_audits audit_logs_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_audits
    ADD CONSTRAINT audit_logs_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: case_notes case_notes_case_note_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_notes
    ADD CONSTRAINT case_notes_case_note_action_id_fkey FOREIGN KEY (case_note_action_id) REFERENCES public.case_note_actions(id);


--
-- Name: case_tags case_tags_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_tags
    ADD CONSTRAINT case_tags_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: case_tags case_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_tags
    ADD CONSTRAINT case_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);


--
-- Name: cases cases_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id);


--
-- Name: cases cases_how_did_you_hear_about_us_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_how_did_you_hear_about_us_source_id_fkey FOREIGN KEY (how_did_you_hear_about_us_source_id) REFERENCES public.how_did_you_hear_about_us_sources(id);


--
-- Name: cases cases_intake_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases
    ADD CONSTRAINT cases_intake_source_id_fkey FOREIGN KEY (intake_source_id) REFERENCES public.intake_sources(id);


--
-- Name: cases_officers cases_officers_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases_officers
    ADD CONSTRAINT cases_officers_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: cases_officers cases_officers_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cases_officers
    ADD CONSTRAINT cases_officers_officer_id_fkey FOREIGN KEY (officer_id) REFERENCES public.officers(id);


--
-- Name: civilians civilians_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilians
    ADD CONSTRAINT civilians_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: civilians civilians_civilian_title_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilians
    ADD CONSTRAINT civilians_civilian_title_id_fkey FOREIGN KEY (civilian_title_id) REFERENCES public.civilian_titles(id);


--
-- Name: civilians civilians_gender_identity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilians
    ADD CONSTRAINT civilians_gender_identity_id_fkey FOREIGN KEY (gender_identity_id) REFERENCES public.gender_identities(id);


--
-- Name: civilians civilians_race_ethnicity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.civilians
    ADD CONSTRAINT civilians_race_ethnicity_id_fkey FOREIGN KEY (race_ethnicity_id) REFERENCES public.race_ethnicities(id);


--
-- Name: complainant_letters complainant_letters_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complainant_letters
    ADD CONSTRAINT complainant_letters_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: complainant_letters complainant_letters_complainant_civilian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complainant_letters
    ADD CONSTRAINT complainant_letters_complainant_civilian_id_fkey FOREIGN KEY (complainant_civilian_id) REFERENCES public.civilians(id);


--
-- Name: complainant_letters complainant_letters_complainant_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.complainant_letters
    ADD CONSTRAINT complainant_letters_complainant_officer_id_fkey FOREIGN KEY (complainant_officer_id) REFERENCES public.cases_officers(id);


--
-- Name: data_access_audits data_access_audits_audit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_access_audits
    ADD CONSTRAINT data_access_audits_audit_id_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id);


--
-- Name: data_access_values data_access_values_data_access_audit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_access_values
    ADD CONSTRAINT data_access_values_data_access_audit_id_fkey FOREIGN KEY (data_access_audit_id) REFERENCES public.data_access_audits(id);


--
-- Name: data_change_audits data_change_audits_audit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.data_change_audits
    ADD CONSTRAINT data_change_audits_audit_id_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id);


--
-- Name: export_audits export_audits_audit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.export_audits
    ADD CONSTRAINT export_audits_audit_id_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id);


--
-- Name: file_audits file_audits_audit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file_audits
    ADD CONSTRAINT file_audits_audit_id_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id);


--
-- Name: legacy_data_access_audits legacy_data_access_audits_audit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.legacy_data_access_audits
    ADD CONSTRAINT legacy_data_access_audits_audit_id_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id);


--
-- Name: letter_officers letter_officers_officer_history_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letter_officers
    ADD CONSTRAINT letter_officers_officer_history_option_id_fkey FOREIGN KEY (officer_history_option_id) REFERENCES public.officer_history_options(id);


--
-- Name: officers_allegations officers_allegations_allegation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers_allegations
    ADD CONSTRAINT officers_allegations_allegation_id_fkey FOREIGN KEY (allegation_id) REFERENCES public.allegations(id);


--
-- Name: officers_allegations officers_allegations_case_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers_allegations
    ADD CONSTRAINT officers_allegations_case_officer_id_fkey FOREIGN KEY (case_officer_id) REFERENCES public.cases_officers(id);


--
-- Name: officers officers_district_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(id);


--
-- Name: officers officers_supervisor_officer_number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.officers
    ADD CONSTRAINT officers_supervisor_officer_number_fkey FOREIGN KEY (supervisor_officer_number) REFERENCES public.officers(officer_number);


--
-- Name: referral_letter_officer_history_notes referral_letter_officer_history_referral_letter_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_history_notes
    ADD CONSTRAINT referral_letter_officer_history_referral_letter_officer_id_fkey FOREIGN KEY (referral_letter_officer_id) REFERENCES public.letter_officers(id);


--
-- Name: referral_letter_officer_recommended_actions referral_letter_officer_recommended_actions_recommended_action_; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_recommended_actions
    ADD CONSTRAINT referral_letter_officer_recommended_actions_recommended_action_ FOREIGN KEY (recommended_action_id) REFERENCES public.recommended_actions(id);


--
-- Name: referral_letter_officer_recommended_actions referral_letter_officer_recommended_actions_referral_letter_off; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letter_officer_recommended_actions
    ADD CONSTRAINT referral_letter_officer_recommended_actions_referral_letter_off FOREIGN KEY (referral_letter_officer_id) REFERENCES public.letter_officers(id);


--
-- Name: letter_officers referral_letter_officers_case_officer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.letter_officers
    ADD CONSTRAINT referral_letter_officers_case_officer_id_fkey FOREIGN KEY (case_officer_id) REFERENCES public.cases_officers(id);


--
-- Name: referral_letters referral_letters_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_letters
    ADD CONSTRAINT referral_letters_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- Name: case_notes user_actions_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.case_notes
    ADD CONSTRAINT user_actions_case_id_fkey FOREIGN KEY (case_id) REFERENCES public.cases(id);


--
-- PostgreSQL database dump complete
--

