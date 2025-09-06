-- #####################################################################
-- ## Table 1: users
-- ## Stores login and personal info for each user.
-- #####################################################################
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- #####################################################################
-- ## Table 2: tags
-- ## A master list of tags you will manually enter. Used for dropdowns.
-- #####################################################################
CREATE TABLE tags (
    tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_name VARCHAR(50) UNIQUE NOT NULL
);
-- You will manually add tags here, e.g.:
-- INSERT INTO tags (tag_name) VALUES ('Design'), ('Frontend'), ('Backend'), ('Urgent');

-- #####################################################################
-- ## Table 3: projects
-- ## Stores project info and links to the manager (an owner).
-- #####################################################################
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    -- 'manager_id' is the user who created/manages the project.
    manager_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    deadline DATE,
    priority VARCHAR(50) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    -- We store the URL to the image, not the image itself.
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- #####################################################################
-- ## Table 4: project_members
-- ## This is CRITICAL. It lists which users are on which project team.
-- #####################################################################
CREATE TABLE project_members (
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, user_id) -- Ensures a user can't be on the same project twice.
);

-- #####################################################################
-- ## Table 5: tasks
-- ## Stores all tasks, linked to a project, an assignee, and a creator.
-- #####################################################################
CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'To-Do' CHECK (status IN ('To-Do', 'In Progress', 'Done')),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    -- 'assignee_id' is who the task is assigned TO.
    assignee_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    -- 'created_by_id' is who CREATED the task.
    created_by_id UUID NOT NULL REFERENCES users(user_id),
    due_date DATE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- #####################################################################
-- ## Table 6 & 7: Junction tables for tags
-- ## These link tags to projects and tasks.
-- #####################################################################
CREATE TABLE project_tags (
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE task_tags (
    task_id UUID NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);