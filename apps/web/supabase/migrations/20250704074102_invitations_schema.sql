/*
 * -------------------------------------------------------
 * E-Invitation RSVP Schema
 * This migration creates the schema for the e-invitation system
 * including invitations, guests, RSVP responses, and templates
 * -------------------------------------------------------
 */

-- Create invitations table
create table if not exists
    public.invitations
(
    id                  uuid unique                  not null default extensions.uuid_generate_v4(),
    title               varchar(255)                 not null,
    description         text,
    event_date          timestamp with time zone,
    location            text,
    image_url           varchar(1000),
    creator_id          uuid                         not null references public.accounts(id) on delete cascade,
    created_at          timestamp with time zone     not null default now(),
    updated_at          timestamp with time zone     not null default now(),
    updated_by          uuid references auth.users,
    template_id         uuid,
    custom_fields       jsonb                        default '{}'::jsonb not null,
    is_public           boolean                      default false not null,
    max_guests          integer,
    rsvp_deadline       timestamp with time zone,
    primary key (id)
);

comment on table public.invitations is 'E-invitations created by users';
comment on column public.invitations.title is 'The title of the invitation/event';
comment on column public.invitations.description is 'Detailed description of the event';
comment on column public.invitations.event_date is 'When the event takes place';
comment on column public.invitations.location is 'Where the event takes place';
comment on column public.invitations.image_url is 'URL to the invitation image/background';
comment on column public.invitations.creator_id is 'The account that created this invitation';
comment on column public.invitations.custom_fields is 'Additional custom fields for the invitation';
comment on column public.invitations.is_public is 'Whether the invitation is publicly viewable';
comment on column public.invitations.max_guests is 'Maximum number of guests allowed';
comment on column public.invitations.rsvp_deadline is 'Deadline for RSVP responses';

-- Create guests table
create table if not exists
    public.guests
(
    id              uuid unique                  not null default extensions.uuid_generate_v4(),
    name            varchar(255)                 not null,
    email           varchar(320),
    phone           varchar(50),
    invitation_id   uuid                         not null references public.invitations(id) on delete cascade,
    created_at      timestamp with time zone     not null default now(),
    updated_at      timestamp with time zone     not null default now(),
    guest_code      varchar(50)                  unique,
    plus_one_allowed boolean                     default false not null,
    primary key (id)
);

comment on table public.guests is 'Guest list for invitations';
comment on column public.guests.name is 'Full name of the guest';
comment on column public.guests.email is 'Email address of the guest';
comment on column public.guests.phone is 'Phone number of the guest';
comment on column public.guests.invitation_id is 'Which invitation this guest belongs to';
comment on column public.guests.guest_code is 'Unique code for guest to access RSVP';
comment on column public.guests.plus_one_allowed is 'Whether this guest can bring a plus one';

-- Create RSVP responses table
create table if not exists
    public.rsvp_responses
(
    id                    uuid unique                  not null default extensions.uuid_generate_v4(),
    guest_id              uuid                         not null references public.guests(id) on delete cascade,
    status                varchar(20)                  not null default 'pending' check (status in ('pending', 'attending', 'not_attending')),
    dietary_restrictions  text,
    plus_one_count        integer                      default 0 not null,
    plus_one_names        text[],
    response_date         timestamp with time zone     not null default now(),
    message               text,
    primary key (id)
);

comment on table public.rsvp_responses is 'RSVP responses from guests';
comment on column public.rsvp_responses.guest_id is 'Which guest this response belongs to';
comment on column public.rsvp_responses.status is 'Whether the guest is attending or not';
comment on column public.rsvp_responses.dietary_restrictions is 'Any dietary restrictions or allergies';
comment on column public.rsvp_responses.plus_one_count is 'Number of additional guests';
comment on column public.rsvp_responses.plus_one_names is 'Names of additional guests';
comment on column public.rsvp_responses.message is 'Optional message from the guest';

-- Create invitation templates table
create table if not exists
    public.invitation_templates
(
    id              uuid unique                  not null default extensions.uuid_generate_v4(),
    name            varchar(255)                 not null,
    description     text,
    design_config   jsonb                        not null default '{}'::jsonb,
    category        varchar(100)                 not null,
    is_public       boolean                      default false not null,
    created_by      uuid references public.accounts(id) on delete cascade,
    created_at      timestamp with time zone     not null default now(),
    updated_at      timestamp with time zone     not null default now(),
    preview_image   varchar(1000),
    primary key (id)
);

comment on table public.invitation_templates is 'Templates for creating invitations';
comment on column public.invitation_templates.name is 'Name of the template';
comment on column public.invitation_templates.description is 'Description of the template';
comment on column public.invitation_templates.design_config is 'JSON configuration for the template design';
comment on column public.invitation_templates.category is 'Category like wedding, birthday, corporate';
comment on column public.invitation_templates.is_public is 'Whether template is available to all users';
comment on column public.invitation_templates.created_by is 'User who created this template';
comment on column public.invitation_templates.preview_image is 'URL to template preview image';

-- Create indexes for performance
create index if not exists invitations_creator_id_idx on public.invitations (creator_id);
create index if not exists invitations_event_date_idx on public.invitations (event_date);
create index if not exists guests_invitation_id_idx on public.guests (invitation_id);
create index if not exists guests_guest_code_idx on public.guests (guest_code);
create index if not exists rsvp_responses_guest_id_idx on public.rsvp_responses (guest_id);
create index if not exists rsvp_responses_status_idx on public.rsvp_responses (status);
create index if not exists invitation_templates_category_idx on public.invitation_templates (category);
create index if not exists invitation_templates_is_public_idx on public.invitation_templates (is_public);

-- Add foreign key constraint for template_id
alter table public.invitations
    add constraint invitations_template_id_fkey
    foreign key (template_id) references public.invitation_templates(id) on delete set null;

-- Enable RLS on all tables
alter table public.invitations enable row level security;
alter table public.guests enable row level security;
alter table public.rsvp_responses enable row level security;
alter table public.invitation_templates enable row level security;

-- RLS Policies for invitations
-- Users can read their own invitations
create policy invitations_read on public.invitations for
    select
    to authenticated using (
        creator_id = (select id from public.accounts where id = auth.uid())
    );

-- Users can insert their own invitations
create policy invitations_insert on public.invitations for
    insert
    to authenticated with check (
        creator_id = (select id from public.accounts where id = auth.uid())
    );

-- Users can update their own invitations
create policy invitations_update on public.invitations for
    update
    to authenticated using (
        creator_id = (select id from public.accounts where id = auth.uid())
    )
    with check (
        creator_id = (select id from public.accounts where id = auth.uid())
    );

-- Users can delete their own invitations
create policy invitations_delete on public.invitations for
    delete
    to authenticated using (
        creator_id = (select id from public.accounts where id = auth.uid())
    );

-- Public can read public invitations (for RSVP)
create policy invitations_public_read on public.invitations for
    select
    to anon using (is_public = true);

-- RLS Policies for guests
-- Users can manage guests for their own invitations
create policy guests_read on public.guests for
    select
    to authenticated using (
        invitation_id in (
            select id from public.invitations
            where creator_id = (select id from public.accounts where id = auth.uid())
        )
    );

create policy guests_insert on public.guests for
    insert
    to authenticated with check (
        invitation_id in (
            select id from public.invitations
            where creator_id = (select id from public.accounts where id = auth.uid())
        )
    );

create policy guests_update on public.guests for
    update
    to authenticated using (
        invitation_id in (
            select id from public.invitations
            where creator_id = (select id from public.accounts where id = auth.uid())
        )
    );

create policy guests_delete on public.guests for
    delete
    to authenticated using (
        invitation_id in (
            select id from public.invitations
            where creator_id = (select id from public.accounts where id = auth.uid())
        )
    );

-- Anonymous users can read guests for public invitations (for RSVP lookup)
create policy guests_public_read on public.guests for
    select
    to anon using (
        invitation_id in (
            select id from public.invitations where is_public = true
        )
    );

-- RLS Policies for RSVP responses
-- Users can read RSVP responses for their own invitations
create policy rsvp_responses_read on public.rsvp_responses for
    select
    to authenticated using (
        guest_id in (
            select g.id from public.guests g
            join public.invitations i on g.invitation_id = i.id
            where i.creator_id = (select id from public.accounts where id = auth.uid())
        )
    );

-- Anonymous users can insert RSVP responses for public invitations
create policy rsvp_responses_insert on public.rsvp_responses for
    insert
    to anon with check (
        guest_id in (
            select g.id from public.guests g
            join public.invitations i on g.invitation_id = i.id
            where i.is_public = true
        )
    );

-- Anonymous users can update their own RSVP responses
create policy rsvp_responses_update on public.rsvp_responses for
    update
    to anon using (
        guest_id in (
            select g.id from public.guests g
            join public.invitations i on g.invitation_id = i.id
            where i.is_public = true
        )
    );

-- RLS Policies for invitation templates
-- Users can read public templates and their own templates
create policy invitation_templates_read on public.invitation_templates for
    select
    to authenticated using (
        is_public = true or
        created_by = (select id from public.accounts where id = auth.uid())
    );

-- Users can insert their own templates
create policy invitation_templates_insert on public.invitation_templates for
    insert
    to authenticated with check (
        created_by = (select id from public.accounts where id = auth.uid())
    );

-- Users can update their own templates
create policy invitation_templates_update on public.invitation_templates for
    update
    to authenticated using (
        created_by = (select id from public.accounts where id = auth.uid())
    );

-- Users can delete their own templates
create policy invitation_templates_delete on public.invitation_templates for
    delete
    to authenticated using (
        created_by = (select id from public.accounts where id = auth.uid())
    );

-- Anonymous users can read public templates
create policy invitation_templates_public_read on public.invitation_templates for
    select
    to anon using (is_public = true);

-- Grant permissions on tables
grant select, insert, update, delete on table public.invitations to authenticated;
grant select, insert, update, delete on table public.guests to authenticated;
grant select, insert, update, delete on table public.rsvp_responses to authenticated;
grant select, insert, update, delete on table public.invitation_templates to authenticated;

-- Grant anonymous access for RSVP functionality
grant select on table public.invitations to anon;
grant select on table public.guests to anon;
grant insert, update on table public.rsvp_responses to anon;
grant select on table public.invitation_templates to anon;

-- Function to generate unique guest codes
create or replace function kit.generate_guest_code() returns text as $$
declare
    code text;
begin
    -- Generate a 6-character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists, regenerate if it does
    while exists (select 1 from public.guests where guest_code = code) loop
        code := upper(substring(md5(random()::text) from 1 for 6));
    end loop;
    
    return code;
end;
$$ language plpgsql;

-- Trigger to automatically generate guest codes
create or replace function kit.set_guest_code() returns trigger as $$
begin
    if new.guest_code is null then
        new.guest_code := kit.generate_guest_code();
    end if;
    return new;
end;
$$ language plpgsql;

create trigger set_guest_code_trigger
    before insert on public.guests
    for each row
    execute function kit.set_guest_code();

-- Function to update updated_at timestamp
create or replace function kit.update_updated_at_column() returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Triggers to update updated_at timestamps
create trigger update_invitations_updated_at
    before update on public.invitations
    for each row
    execute function kit.update_updated_at_column();

create trigger update_guests_updated_at
    before update on public.guests
    for each row
    execute function kit.update_updated_at_column();

create trigger update_invitation_templates_updated_at
    before update on public.invitation_templates
    for each row
    execute function kit.update_updated_at_column();

-- Storage bucket for invitation images
insert into storage.buckets (id, name, public)
values ('invitation_images', 'invitation_images', true);

-- RLS policies for invitation images storage
create policy invitation_images_read on storage.objects for
    select
    using (bucket_id = 'invitation_images');

create policy invitation_images_insert on storage.objects for
    insert
    to authenticated with check (
        bucket_id = 'invitation_images'
    );

create policy invitation_images_update on storage.objects for
    update
    to authenticated using (
        bucket_id = 'invitation_images'
    );

create policy invitation_images_delete on storage.objects for
    delete
    to authenticated using (
        bucket_id = 'invitation_images'
    );