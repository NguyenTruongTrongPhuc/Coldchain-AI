--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-08-06 12:39:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 25778)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    shipment_id integer,
    alert_type character varying NOT NULL,
    message text,
    "timestamp" timestamp with time zone DEFAULT now(),
    priority character varying,
    status character varying,
    resolution_note text,
    resolved_by_user_id integer,
    resolved_at timestamp with time zone
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25777)
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO postgres;

--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 227
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- TOC entry 224 (class 1259 OID 25742)
-- Name: device_activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device_activity_logs (
    id integer NOT NULL,
    device_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now(),
    log_type character varying,
    content text NOT NULL,
    user_id integer
);


ALTER TABLE public.device_activity_logs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25741)
-- Name: device_activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.device_activity_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 223
-- Name: device_activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_activity_logs_id_seq OWNED BY public.device_activity_logs.id;


--
-- TOC entry 220 (class 1259 OID 25714)
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    id integer NOT NULL,
    tracker_id character varying NOT NULL,
    name character varying,
    status character varying,
    connection character varying,
    last_location character varying,
    battery double precision
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25713)
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_id_seq OWNER TO postgres;

--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 219
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- TOC entry 226 (class 1259 OID 25762)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    name character varying NOT NULL,
    status character varying,
    file_path character varying,
    created_at timestamp with time zone DEFAULT now(),
    user_id integer
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25761)
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 225
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- TOC entry 222 (class 1259 OID 25726)
-- Name: shipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipments (
    id integer NOT NULL,
    name character varying NOT NULL,
    status character varying,
    start_location character varying,
    end_location character varying,
    current_lat double precision,
    current_lng double precision,
    device_id integer
);


ALTER TABLE public.shipments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25725)
-- Name: shipments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shipments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shipments_id_seq OWNER TO postgres;

--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 221
-- Name: shipments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shipments_id_seq OWNED BY public.shipments.id;


--
-- TOC entry 218 (class 1259 OID 25702)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying,
    email character varying NOT NULL,
    hashed_password character varying NOT NULL,
    is_active boolean
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 25701)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4774 (class 2604 OID 25781)
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- TOC entry 4770 (class 2604 OID 25745)
-- Name: device_activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_activity_logs ALTER COLUMN id SET DEFAULT nextval('public.device_activity_logs_id_seq'::regclass);


--
-- TOC entry 4768 (class 2604 OID 25717)
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- TOC entry 4772 (class 2604 OID 25765)
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- TOC entry 4769 (class 2604 OID 25729)
-- Name: shipments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments ALTER COLUMN id SET DEFAULT nextval('public.shipments_id_seq'::regclass);


--
-- TOC entry 4767 (class 2604 OID 25705)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4960 (class 0 OID 25778)
-- Dependencies: 228
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (id, shipment_id, alert_type, message, "timestamp", priority, status, resolution_note, resolved_by_user_id, resolved_at) FROM stdin;
1	1	Nhiệt độ thấp	Ghi nhận sự kiện bất thường cho lô hàng Lô hàng Trái cây #1	2025-08-06 12:21:49.308656+07	Trung bình	active	\N	\N	\N
2	3	Nhiệt độ cao	Ghi nhận sự kiện bất thường cho lô hàng Lô hàng Hải sản #3	2025-08-06 10:21:49.308656+07	Thấp	active	\N	\N	\N
3	5	Va đập mạnh	Ghi nhận sự kiện bất thường cho lô hàng Lô hàng Vắc-xin #5	2025-08-06 08:21:49.308656+07	Cao	active	\N	\N	\N
4	7	Nhiệt độ thấp	Ghi nhận sự kiện bất thường cho lô hàng Lô hàng Vắc-xin #7	2025-08-06 06:21:49.308656+07	Cao	active	\N	\N	\N
5	9	Nhiệt độ cao	Ghi nhận sự kiện bất thường cho lô hàng Lô hàng Vắc-xin #9	2025-08-06 04:21:49.308656+07	Trung bình	active	\N	\N	\N
6	2	Dự báo nguy cơ	AI dự báo nguy cơ	2025-08-06 12:21:49.305897+07	Thấp	resolved	Đã kiểm tra, không có vấn đề.	1	2025-08-06 12:21:49.309661+07
\.


--
-- TOC entry 4956 (class 0 OID 25742)
-- Dependencies: 224
-- Data for Name: device_activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device_activity_logs (id, device_id, "timestamp", log_type, content, user_id) FROM stdin;
\.


--
-- TOC entry 4952 (class 0 OID 25714)
-- Dependencies: 220
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (id, tracker_id, name, status, connection, last_location, battery) FROM stdin;
1	TRK-2025-001	Thiết bị Container 1	inactive	connected	Cần Thơ	57
2	TRK-2025-002	Thiết bị Container 2	active	disconnected	TP.HCM	35
3	TRK-2025-003	Thiết bị Thùng hàng 3	active	connected	Cần Thơ	62
4	TRK-2025-004	Thiết bị Xe tải 4	maintenance	connected	TP.HCM	94
5	TRK-2025-005	Thiết bị Thùng hàng 5	inactive	connected	Cần Thơ	48
6	TRK-2025-006	Thiết bị Container 6	inactive	connected	Đà Nẵng	42
7	TRK-2025-007	Thiết bị Thùng hàng 7	inactive	connected	Cần Thơ	97
8	TRK-2025-008	Thiết bị Thùng hàng 8	inactive	connected	Cần Thơ	73
9	TRK-2025-009	Thiết bị Xe tải 9	inactive	connected	TP.HCM	10
10	TRK-2025-010	Thiết bị Xe tải 10	active	connected	Đà Nẵng	33
11	TRK-2025-011	Thiết bị Thùng hàng 11	maintenance	disconnected	Hà Nội	45
12	TRK-2025-012	Thiết bị Container 12	inactive	disconnected	Cần Thơ	42
13	TRK-2025-013	Thiết bị Thùng hàng 13	maintenance	disconnected	Đà Nẵng	26
14	TRK-2025-014	Thiết bị Xe tải 14	active	connected	Đà Nẵng	67
15	TRK-2025-015	Thiết bị Container 15	maintenance	connected	TP.HCM	94
\.


--
-- TOC entry 4958 (class 0 OID 25762)
-- Dependencies: 226
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, name, status, file_path, created_at, user_id) FROM stdin;
1	Báo cáo tổng hợp Q2/2025	completed	/fake/path/report_q2.pdf	2025-08-06 12:21:49.31812+07	1
2	Báo cáo hành trình SH-001	completed	/fake/path/sh001.pdf	2025-08-06 12:21:49.31812+07	1
3	Báo cáo tháng 7 (đang xử lý)	processing	\N	2025-08-06 12:21:49.31812+07	1
\.


--
-- TOC entry 4954 (class 0 OID 25726)
-- Dependencies: 222
-- Data for Name: shipments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipments (id, name, status, start_location, end_location, current_lat, current_lng, device_id) FROM stdin;
1	Lô hàng Trái cây #1	failed	Cảng Cát Lái	Kho Long Biên	10.757903106518391	106.77329200370804	1
2	Lô hàng Trái cây #2	failed	Kho Đà Nẵng	Sân bay Nội Bài	16.051424581219326	108.20088188382222	2
3	Lô hàng Hải sản #3	in_transit	Kho Thủ Đức	Sân bay Nội Bài	10.845197789843658	106.75101178967164	3
4	Lô hàng Trái cây #4	completed	Kho Cần Thơ	Sân bay Nội Bài	10.04435383116561	105.74229776556999	4
5	Lô hàng Vắc-xin #5	in_transit	Kho Đà Nẵng	Sân bay Nội Bài	16.055423337743733	108.20372465342675	5
6	Lô hàng Hải sản #6	failed	Kho Thủ Đức	Kho Long Biên	10.84649768069962	106.75789483569929	6
7	Lô hàng Vắc-xin #7	pending	Kho Cần Thơ	Kho Long Biên	10.043547737357375	105.74567433123774	7
8	Lô hàng Trái cây #8	completed	Kho Cần Thơ	Sân bay Nội Bài	10.040759424932254	105.74310470937013	8
9	Lô hàng Vắc-xin #9	pending	Kho Thủ Đức	Kho Long Biên	10.85254045803585	106.75642514176936	9
10	Lô hàng Hải sản #10	pending	Kho Thủ Đức	Kho Long Biên	10.848540599737088	106.756107716784	10
\.


--
-- TOC entry 4950 (class 0 OID 25702)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, hashed_password, is_active) FROM stdin;
1	Admin User	admin@example.com	$2b$12$8l9IAMNQSRmPJMYOJTqEMu3IFbrHycZ/aLYRpsr9HNOpQ4II7gvmi	t
2	Manager User	manager@example.com	$2b$12$xSXLkILpZg/BngeAXKkbPOwtKhnNJrhoWxYFEUGXBFDh3B8Wm0Wpq	t
3	Nguyễn Trương Trọng Phúc	phuc.nguyenhcmutk21@hcmut.edu.vn	$2b$12$iHY5jYNIXI65EyATKYsUjuB7x47TrDQP7R7iibhvTL5sQ4cTBJiTK	t
\.


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 227
-- Name: alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerts_id_seq', 6, true);


--
-- TOC entry 4973 (class 0 OID 0)
-- Dependencies: 223
-- Name: device_activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_activity_logs_id_seq', 1, false);


--
-- TOC entry 4974 (class 0 OID 0)
-- Dependencies: 219
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devices_id_seq', 15, true);


--
-- TOC entry 4975 (class 0 OID 0)
-- Dependencies: 225
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 3, true);


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 221
-- Name: shipments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shipments_id_seq', 10, true);


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4796 (class 2606 OID 25786)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 25750)
-- Name: device_activity_logs device_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_activity_logs
    ADD CONSTRAINT device_activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 25721)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 25770)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 25733)
-- Name: shipments shipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_pkey PRIMARY KEY (id);


--
-- TOC entry 4780 (class 2606 OID 25709)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 1259 OID 25797)
-- Name: ix_alerts_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_alerts_id ON public.alerts USING btree (id);


--
-- TOC entry 4783 (class 1259 OID 25723)
-- Name: ix_devices_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_devices_id ON public.devices USING btree (id);


--
-- TOC entry 4784 (class 1259 OID 25724)
-- Name: ix_devices_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_devices_name ON public.devices USING btree (name);


--
-- TOC entry 4785 (class 1259 OID 25722)
-- Name: ix_devices_tracker_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_devices_tracker_id ON public.devices USING btree (tracker_id);


--
-- TOC entry 4792 (class 1259 OID 25776)
-- Name: ix_reports_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_reports_name ON public.reports USING btree (name);


--
-- TOC entry 4786 (class 1259 OID 25740)
-- Name: ix_shipments_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_shipments_id ON public.shipments USING btree (id);


--
-- TOC entry 4787 (class 1259 OID 25739)
-- Name: ix_shipments_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_shipments_name ON public.shipments USING btree (name);


--
-- TOC entry 4776 (class 1259 OID 25710)
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- TOC entry 4777 (class 1259 OID 25711)
-- Name: ix_users_full_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_full_name ON public.users USING btree (full_name);


--
-- TOC entry 4778 (class 1259 OID 25712)
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- TOC entry 4802 (class 2606 OID 25792)
-- Name: alerts alerts_resolved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_resolved_by_user_id_fkey FOREIGN KEY (resolved_by_user_id) REFERENCES public.users(id);


--
-- TOC entry 4803 (class 2606 OID 25787)
-- Name: alerts alerts_shipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id);


--
-- TOC entry 4799 (class 2606 OID 25751)
-- Name: device_activity_logs device_activity_logs_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_activity_logs
    ADD CONSTRAINT device_activity_logs_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


--
-- TOC entry 4800 (class 2606 OID 25756)
-- Name: device_activity_logs device_activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device_activity_logs
    ADD CONSTRAINT device_activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4801 (class 2606 OID 25771)
-- Name: reports reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4798 (class 2606 OID 25734)
-- Name: shipments shipments_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipments
    ADD CONSTRAINT shipments_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.devices(id);


-- Completed on 2025-08-06 12:39:42

--
-- PostgreSQL database dump complete
--

