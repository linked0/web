import pygame
import math
import sys

# --------- Utility Function ---------
def get_closest_point_on_segment(A, B, P):
    """
    Given segment endpoints A and B and point P,
    return the closest point on the segment AB to P.
    A, B, and P are (x, y) tuples.
    """
    Ax, Ay = A
    Bx, By = B
    Px, Py = P
    ABx = Bx - Ax
    ABy = By - Ay
    # Compute the projection factor t of P onto AB
    t = ((Px - Ax) * ABx + (Py - Ay) * ABy) / (ABx * ABx + ABy * ABy)
    t = max(0, min(1, t))  # clamp to segment
    closest = (Ax + t * ABx, Ay + t * ABy)
    return closest

# --------- Pygame Initialization ---------
pygame.init()
width, height = 800, 600
screen = pygame.display.set_mode((width, height))
pygame.display.set_caption("Bouncing Ball in a Spinning Hexagon")
clock = pygame.time.Clock()

# --------- Simulation Parameters ---------
# Hexagon parameters
hexagon_center = (width / 2, height / 2)
hexagon_radius = 250
hexagon_angle = 0  # initial rotation (radians)
angular_velocity = math.radians(30)  # hexagon rotates 30° per second

# Ball parameters
ball_radius = 15
ball_pos = [width / 2, height / 2]   # start at center of screen
ball_velocity = [200, -300]          # initial velocity (pixels/sec)

# Physics parameters
gravity = 500            # pixels/s^2 downward
restitution = 0.9        # bounce energy retention factor (0 < r <= 1)
air_friction = 0.999     # slight damping per frame

# --------- Main Loop ---------
running = True
while running:
    dt = clock.tick(60) / 1000.0  # delta time in seconds (aim for 60 FPS)
    
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Update hexagon rotation
    hexagon_angle += angular_velocity * dt

    # Compute hexagon vertices (a regular hexagon)
    vertices = []
    for i in range(6):
        angle = hexagon_angle + math.radians(60 * i)
        x = hexagon_center[0] + hexagon_radius * math.cos(angle)
        y = hexagon_center[1] + hexagon_radius * math.sin(angle)
        vertices.append((x, y))
    
    # --------- Update Ball Physics ---------
    # Apply gravity
    ball_velocity[1] += gravity * dt
    
    # Apply a bit of air friction/damping
    ball_velocity[0] *= air_friction
    ball_velocity[1] *= air_friction
    
    # Update position
    ball_pos[0] += ball_velocity[0] * dt
    ball_pos[1] += ball_velocity[1] * dt
    
    # --------- Collision Detection & Response ---------
    # For each edge of the hexagon, check for collision
    for i in range(6):
        A = vertices[i]
        B = vertices[(i + 1) % 6]
        closest = get_closest_point_on_segment(A, B, ball_pos)
        
        # Vector from the closest point on edge to ball center
        dx = ball_pos[0] - closest[0]
        dy = ball_pos[1] - closest[1]
        dist = math.hypot(dx, dy)
        
        if dist < ball_radius:
            # Compute collision normal (avoid division by zero)
            if dist != 0:
                n = (dx / dist, dy / dist)
            else:
                # Fallback: use edge normal (perpendicular to AB)
                edge_dx = B[0] - A[0]
                edge_dy = B[1] - A[1]
                n = (-edge_dy, edge_dx)
                norm = math.hypot(n[0], n[1])
                if norm != 0:
                    n = (n[0] / norm, n[1] / norm)
                else:
                    n = (0, 0)
            
            # Determine the velocity of the wall (edge) at the collision point.
            # Since the hexagon rotates around its center, the velocity at point P is:
            # v_wall = angular_velocity x (P - hexagon_center)
            rx = closest[0] - hexagon_center[0]
            ry = closest[1] - hexagon_center[1]
            # In 2D, the perpendicular vector for counterclockwise rotation is (-ry, rx)
            wall_vx = angular_velocity * (-ry)
            wall_vy = angular_velocity * (rx)
            
            # Compute relative velocity of ball with respect to the wall at the collision point
            rel_vx = ball_velocity[0] - wall_vx
            rel_vy = ball_velocity[1] - wall_vy
            rel_dot_n = rel_vx * n[0] + rel_vy * n[1]
            
            # Only process collision if ball is moving into the wall
            if rel_dot_n < 0:
                # Reflect the relative velocity
                rel_vx_ref = rel_vx - 2 * rel_dot_n * n[0]
                rel_vy_ref = rel_vy - 2 * rel_dot_n * n[1]
                
                # Apply restitution to simulate energy loss
                new_rel_vx = rel_vx_ref * restitution
                new_rel_vy = rel_vy_ref * restitution
                
                # The new absolute velocity is the wall velocity plus the reflected relative velocity
                ball_velocity[0] = wall_vx + new_rel_vx
                ball_velocity[1] = wall_vy + new_rel_vy
                
                # Adjust position so the ball is no longer overlapping the wall
                overlap = ball_radius - dist
                ball_pos[0] += n[0] * overlap
                ball_pos[1] += n[1] * overlap

    # --------- Drawing ---------
    screen.fill((30, 30, 30))  # dark background
    
    # Draw the hexagon (outline only)
    pygame.draw.polygon(screen, (0, 255, 0), vertices, 3)
    
    # Draw the ball
    pygame.draw.circle(screen, (255, 0, 0), (int(ball_pos[0]), int(ball_pos[1])), ball_radius)
    
    pygame.display.flip()

pygame.quit()
sys.exit()
